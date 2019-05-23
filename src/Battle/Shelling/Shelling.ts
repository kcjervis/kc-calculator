import { Formation, Engagement } from '../../constants'
import { IShip } from '../../objects'
import { sumBy } from 'lodash-es'
import DayCombatSpecialAttack from './DayCombatSpecialAttack'
import { ShipRole, ShellingType, ShellingPowerFactors, ShellingInformation, ShellingAccuracyFactors } from '../../types'

import ShellingPower from './ShellingPower'
import ShellingAccuracy from './ShellingAccuracy'

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
    public ship: IShip,
    public role: ShipRole,
    public formation: Formation = Formation.LineAhead,
    public engagement: Engagement = Engagement.Parallel,
    public specialAttack?: DayCombatSpecialAttack,
    public combinedFleetFactors = { power: 0, accuracy: 0 },
    public isCritical = false
  ) {}

  get isArmoredShip() {
    const { shipType } = this.ship
    return (
      shipType.isBattleshipClass ||
      shipType.isHeavyCruiserClass ||
      shipType.either('AircraftCarrier', 'ArmoredAircraftCarrier')
    )
  }

  get shellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasEquipment } = this.ship
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

  get canParticipate() {
    const { shellingType, ship } = this
    if (shellingType == 'CarrierShelling') {
      return ship.planes.some(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    }
    return true
  }

  private get formationModifiers() {
    const { role, formation } = this
    return formation.getModifiersWithRole(role).shelling
  }

  private get specialAttackModifiers(): AttackModifiers {
    const { specialAttack } = this
    if (!specialAttack) {
      return { power: 1, accuracy: 1 }
    }
    return { power: specialAttack.modifier.power, accuracy: 1 }
  }

  private get apShellModifiers(): AttackModifiers {
    const { ship } = this
    if (this.isCritical) {
      return { power: 1, accuracy: 1 }
    }
    return getApShellModifiers(ship)
  }

  get criticalModifier() {
    return this.isCritical ? 1.5 : 1
  }

  private get proficiencyModifiers() {
    const { ship, specialAttack } = this
    return getProficiencyModifier(ship, specialAttack)
  }

  get power() {
    const {
      shellingType,
      combinedFleetFactors,
      ship,
      formationModifiers,
      engagement,
      specialAttackModifiers,
      apShellModifiers,
      isCritical,
      proficiencyModifiers
    } = this

    const { firepower, torpedo } = ship.stats
    const criticalModifier = isCritical ? 1.5 : 1

    const factors: ShellingPowerFactors = {
      shellingType,
      firepower,
      torpedo,
      bombing: ship.totalEquipmentStats('bombing'),
      improvementModifier: ship.totalEquipmentStats(equip => equip.improvement.shellingPowerModifier),
      combinedFleetFactor: combinedFleetFactors.power,
      formationModifier: formationModifiers.power,
      engagementModifier: engagement.modifier,
      healthModifier: ship.health.shellingPowerModifier,
      cruiserFitBonus: calcCruiserFitBonus(ship),
      specialAttackModifier: specialAttackModifiers.power,
      apShellModifier: apShellModifiers.power,
      criticalModifier,
      proficiencyModifier: proficiencyModifiers.power
    }

    return new ShellingPower(factors)
  }

  get accuracy() {
    const { combinedFleetFactors, ship, formationModifiers, specialAttackModifiers, apShellModifiers } = this

    const { level, stats, totalEquipmentStats } = ship

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
