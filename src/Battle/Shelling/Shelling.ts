import { Formation, Engagement, FleetType, Side } from '../../constants'
import { IShip } from '../../objects'
import { sumBy } from 'lodash-es'
import DayCombatSpecialAttack from './DayCombatSpecialAttack'
import {
  ShipInformation,
  ShipRole,
  AntiInstallationModifiers,
  ShellingType,
  ShellingPowerFactors,
  ShellingInformation,
  ShellingAccuracyFactors
} from '../../types'

import ShellingPower from './ShellingPower'
import ShellingAccuracy from './ShellingAccuracy'
import getCombinedFleetFactor from './getCombinedFleetFactor'

type AttackModifiers = { power: number; accuracy: number }

/**
 * 巡洋艦砲フィット補正
 *
 * 軽巡軽量砲補正と伊重巡フィット砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#軽巡軽量砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#伊重巡フィット砲補正
 */
export const calcCruiserFitBonus = (ship: IShip) => {
  let fitBonus = 0
  if (ship.shipType.either('LightCruiser', 'TorpedoCruiser', 'TrainingCruiser')) {
    const singleGunCount = ship.countEquipment(equip => [4, 11].includes(equip.masterId))
    const twinGunCount = ship.countEquipment(equip => [65, 119, 139].includes(equip.masterId))
    fitBonus += Math.sqrt(singleGunCount) + 2 * Math.sqrt(twinGunCount)
  }
  if (ship.shipClass.is('ZaraClass')) {
    fitBonus += Math.sqrt(ship.countEquipment(162))
  }
  return fitBonus
}

/**
 * 徹甲弾補正
 */
export const getApShellModifiers = (ship: IShip): AttackModifiers => {
  const { hasEquipment } = ship
  const modifier = { power: 1, accuracy: 1 }
  if (
    !hasEquipment(equip => equip.category.is('ArmorPiercingShell')) ||
    !hasEquipment(equip => equip.category.isMainGun)
  ) {
    return modifier
  }

  const hasSecondaryGun = hasEquipment(equip => equip.category.is('SecondaryGun'))
  const hasRader = hasEquipment(equip => equip.category.isRadar)

  if (hasSecondaryGun && hasRader) {
    return { power: 1.15, accuracy: 1.3 }
  }
  if (hasSecondaryGun) {
    return { power: 1.15, accuracy: 1.2 }
  }
  if (hasRader) {
    return { power: 1.1, accuracy: 1.25 }
  }
  return { power: 1.08, accuracy: 1.1 }
}

/**
 * 熟練度補正
 * 戦爆連合は適当
 */
export const getProficiencyModifier = (ship: IShip, specialAttack?: DayCombatSpecialAttack) => {
  const modifier = { power: 1 }
  if (specialAttack && specialAttack.isCarrierSpecialAttack) {
    const planes = ship.planes.filter(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    if (planes.some(plane => plane.index === 0)) {
      modifier.power = 1.25
    } else {
      modifier.power = 1.106
    }
    return modifier
  }

  const planes = ship.planes.filter(
    ({ slotSize, category }) =>
      slotSize > 0 && (category.isDiveBomber || category.isTorpedoBomber || category.is('LargeFlyingBoat'))
  )
  modifier.power =
    1 +
    sumBy(planes, plane => {
      if (plane.index === 0) {
        return plane.equipment.proficiency.criticalPowerModifier / 100
      }
      return plane.equipment.proficiency.criticalPowerModifier / 200
    })
  return modifier
}

const calcShellingAccuracy = (
  ship: IShip,
  formationModifier: number,
  fitBonus = 0,
  artillerySpottingAccuracyModifier = 1,
  apShellAccuracyModifier = 1
) => {
  const { stats, totalEquipmentStats, level, morale } = ship
  const totalEquipAccuracy = ship.totalEquipmentStats(
    equip => equip.accuracy + equip.improvement.shellingAccuracyModifier
  )
  const moraleModifier = ship.morale.shellingAccuracyModifier

  const totalEquipmentAccuracy = totalEquipmentStats(
    equip => equip.accuracy + equip.improvement.shellingAccuracyModifier
  )
  const baseAccuracy = 90 + Math.sqrt(1.5 * stats.luck) + 2 * Math.sqrt(level) + totalEquipmentAccuracy

  const postFitBonus = baseAccuracy * formationModifier * morale.shellingAccuracyModifier + fitBonus
  return Math.floor(postFitBonus * artillerySpottingAccuracyModifier * apShellAccuracyModifier)
}

export default class Shelling implements ShellingInformation {
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public specialAttack?: DayCombatSpecialAttack,
    public isCritical = false,

    public specialMultiplicative = 1,

    public antiInstallationModifiers = {
      shipTypeMultiplicative: 1,
      shipTypeAdditive: 0,
      multiplicative: 1,
      additive: 0,
      postCap: 1
    }
  ) {}

  get shellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasEquipment } = this.attacker.ship
    if (shipType.isAircraftCarrierClass) {
      return 'CarrierShelling'
    }

    if (!shipClass.is('RevisedKazahayaClass') && !isInstallation) {
      return 'Shelling'
    }

    if (hasEquipment(equip => equip.category.isAerialCombatAircraft)) {
      return 'CarrierShelling'
    }

    return 'Shelling'
  }

  private get combinedFleetFactors() {
    const { attacker, defender } = this
    const power = getCombinedFleetFactor(attacker, defender)
    // accuracy 仮置き
    return { power, accuracy: 1 }
  }

  private get formationModifiers() {
    const { role, formation } = this.attacker
    return formation.getModifiersWithRole(role).shelling
  }

  private get engagementModifier() {
    return this.attacker.engagement.modifier
  }

  private get apShellModifiers() {
    const { attacker, defender } = this
    const modifier = { power: 1, accuracy: 1 }

    const defenderShipType = defender.ship.shipType
    if (
      defenderShipType.isBattleshipClass ||
      defenderShipType.isHeavyCruiserClass ||
      defenderShipType.either('AircraftCarrier', 'ArmoredAircraftCarrier')
    ) {
      return modifier
    }

    const { hasEquipment } = attacker.ship

    if (
      !hasEquipment(equip => equip.category.is('ArmorPiercingShell')) ||
      !hasEquipment(equip => equip.category.isMainGun)
    ) {
      return modifier
    }

    const hasSecondaryGun = hasEquipment(equip => equip.category.is('SecondaryGun'))
    const hasRader = hasEquipment(equip => equip.category.isRadar)

    if (hasSecondaryGun && hasRader) {
      return { power: 1.15, accuracy: 1.3 }
    }
    if (hasSecondaryGun) {
      return { power: 1.15, accuracy: 1.2 }
    }
    if (hasRader) {
      return { power: 1.1, accuracy: 1.25 }
    }
    return { power: 1.08, accuracy: 1.1 }
  }

  get canParticipate() {
    const { shellingType, attacker } = this
    if (shellingType == 'CarrierShelling') {
      return attacker.ship.planes.some(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    }
    return true
  }

  private get specialAttackModifiers(): AttackModifiers {
    const { specialAttack } = this
    if (!specialAttack) {
      return { power: 1, accuracy: 1 }
    }
    return { power: specialAttack.modifier.power, accuracy: 1 }
  }

  get criticalModifier() {
    return this.isCritical ? 1.5 : 1
  }

  private get proficiencyModifiers() {
    const { attacker, specialAttack } = this
    return getProficiencyModifier(attacker.ship, specialAttack)
  }

  get power() {
    const {
      attacker,

      shellingType,
      combinedFleetFactors,
      formationModifiers,
      engagementModifier,

      antiInstallationModifiers,
      specialAttackModifiers,
      apShellModifiers,
      isCritical,
      proficiencyModifiers,

      specialMultiplicative
    } = this

    const { stats, totalEquipmentStats, health } = attacker.ship
    const { firepower, torpedo } = stats
    const healthModifier = health.shellingPowerModifier
    const cruiserFitBonus = calcCruiserFitBonus(attacker.ship)
    const criticalModifier = isCritical ? 1.5 : 1

    const factors: ShellingPowerFactors = {
      shellingType,
      firepower,
      torpedo,
      bombing: totalEquipmentStats('bombing'),
      improvementModifier: totalEquipmentStats(equip => equip.improvement.shellingPowerModifier),
      combinedFleetFactor: combinedFleetFactors.power,

      antiInstallationModifiers,
      formationModifier: formationModifiers.power,
      engagementModifier,
      healthModifier,
      cruiserFitBonus,

      specialMultiplicative,
      specialAttackModifier: specialAttackModifiers.power,
      apShellModifier: apShellModifiers.power,
      criticalModifier,
      proficiencyModifier: proficiencyModifiers.power
    }

    return new ShellingPower(factors)
  }

  get accuracy() {
    const { attacker, combinedFleetFactors, formationModifiers, specialAttackModifiers, apShellModifiers } = this

    const { level, stats, totalEquipmentStats } = attacker.ship

    // 仮置き
    const fitGunBonus = 0

    const factors: ShellingAccuracyFactors = {
      combinedFleetFactor: combinedFleetFactors.accuracy,
      level,
      luck: stats.luck,
      equipmentAccuracy: totalEquipmentStats('accuracy'),
      improvementModifier: totalEquipmentStats(equip => equip.improvement.shellingAccuracyModifier),

      moraleModifier: 1,
      formationModifier: formationModifiers.accuracy,
      fitGunBonus,
      specialAttackModifier: specialAttackModifiers.accuracy,
      apShellModifier: apShellModifiers.accuracy
    }

    return new ShellingAccuracy(factors)
  }
}
