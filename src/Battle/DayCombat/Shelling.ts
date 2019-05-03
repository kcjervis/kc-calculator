import { Formation } from '../../constants'
import { IShip } from '../../objects'
import { softcap } from '../../utils'
import { sum } from 'lodash-es'

const calculateFitModifier = (ship: IShip) => 0

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

export default class Shelling {
  public static calcArmorPiercingShellModifier = (attacker: IShip, defender: IShip) => {
    const modifier = { power: 1, accuracy: 1 }
    if (
      !attacker.hasEquipment(equip => equip.category.is('ArmorPiercingShell')) ||
      !attacker.hasEquipment(equip => equip.category.isMainGun)
    ) {
      return modifier
    }

    if (
      !defender.shipType.isBattleshipClass &&
      !defender.shipType.isHeavyCruiserClass &&
      !defender.shipType.either('AircraftCarrier', 'ArmoredAircraftCarrier')
    ) {
      return modifier
    }

    const hasSecondaryGun = attacker.hasEquipment(equip => equip.category.is('SecondaryGun'))
    const hasRader = attacker.hasEquipment(equip => equip.category.isRadar)

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

  public static calcAntiInstallationModifier = (attacker: IShip, defender: IShip) => {
    const modifier = { preCap: 1, additive: 0, postCap: 1 }
    if (defender.stats.speed > 0) {
      return modifier
    }

    return modifier
  }

  public static getCriticalModifier = (ship: IShip) => {
    const pros = ship.planes.filter(plane => plane.slotSize > 0).map(plane => plane.equipment.proficiency.internal)
    const average = sum(pros) / pros.length
    return 1.5
  }

  public static calcBasePower = (ship: IShip) => {
    const { stats, totalEquipmentStats } = ship
    let basePower = 5 + stats.firepower + totalEquipmentStats(equip => equip.improvement.shellingPowerModifier)
    if (ship.shipType.isAircraftCarrierClass) {
      const bombing = totalEquipmentStats('bombing')
      const torpedo = totalEquipmentStats('torpedo')
      basePower += Math.floor(Math.floor(1.3 * bombing) + torpedo) + 15
      basePower = 25 + Math.floor(1.5 * basePower)
    }
    return basePower
  }

  public static calcPower = (
    ship: IShip,
    formationModifier = 1,
    engagementModifier = 1,
    criticalModifier = 1,
    specialAttackModifier = 1,
    apShellModifier = 1
  ) => {
    const { stats, health, totalEquipmentStats } = ship
    const healthModifier = health.shellingPowerModifier

    let fitBonus = 0
    /**
     * 軽巡軽量砲補正
     * https://twitter.com/syoukuretin/status/1069506418376495104
     * https://twitter.com/Xe_UCH/status/1079733461018042368
     * 14㎝連装砲改,ゴトランド砲には軽巡軽量砲補正は無い
     */
    if (ship.shipType.either('LightCruiser', 'TorpedoCruiser', 'TrainingCruiser')) {
      const singleGunCount = ship.countEquipment(equip => [4, 11].includes(equip.masterId))
      const twinGunCount = ship.countEquipment(equip => [65, 119, 139].includes(equip.masterId))
      fitBonus = Math.sqrt(singleGunCount) + 2 * Math.sqrt(twinGunCount)
    }
    if (ship.shipClass.is('ZaraClass')) {
      fitBonus = Math.sqrt(ship.countEquipment(162))
    }

    const basePower = Shelling.calcBasePower(ship)
    const preCap = basePower * formationModifier * engagementModifier * healthModifier + fitBonus

    let postCap = Math.floor(softcap(180, preCap)) * specialAttackModifier
    if (apShellModifier > 1) {
      postCap = Math.floor(postCap * apShellModifier)
    }
    if (criticalModifier > 1) {
      postCap = Math.floor(postCap * criticalModifier)
    }
    return postCap
  }

  public static calcAccuracy = calcShellingAccuracy

  public power = 0
  public accuracy = 0

  constructor(ship: IShip, formation: Formation = Formation.LineAhead) {}
}
