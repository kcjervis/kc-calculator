import { Formation } from '../../constants'
import { IShip } from '../../objects'
import { softcap } from '../../utils'
import { sum, sumBy } from 'lodash-es'

type ShellingType = 'Shelling' | 'CarrierShelling'

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
  public static readonly cap = 180

  private static getShellingType = (ship: IShip): ShellingType => {
    const { shipType, shipClass, isInstallation } = ship
    if (shipType.isAircraftCarrierClass) {
      return 'CarrierShelling'
    }

    if (!shipClass.is('RevisedKazahayaClass') && !isInstallation) {
      return 'Shelling'
    }

    if (ship.hasEquipment(equip => equip.category.isAerialCombatAircraft)) {
      return 'CarrierShelling'
    }

    return 'Shelling'
  }

  private static canParticipate = (ship: IShip) => {
    const shellingType = Shelling.getShellingType(ship)
    if (shellingType == 'CarrierShelling') {
      return ship.planes.some(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    }
    return true
  }

  public static isEffectiveShip = ({ shipType }: IShip) =>
    shipType.isBattleshipClass ||
    shipType.isHeavyCruiserClass ||
    shipType.either('AircraftCarrier', 'ArmoredAircraftCarrier')

  public static calcArmorPiercingShellModifier = (ship: IShip) => {
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

  public static calcAntiInstallationModifier = (attacker: IShip, defender: IShip) => {
    const modifier = { preCap: 1, additive: 0, postCap: 1 }
    if (defender.stats.speed > 0) {
      return modifier
    }

    return modifier
  }

  public static calcProficiencyModifier = (ship: IShip) => {
    const planes = ship.planes.filter(
      ({ slotSize, category }) =>
        slotSize > 0 && (category.isDiveBomber || category.isTorpedoBomber || category.is('LargeFlyingBoat'))
    )
    return sumBy(planes, plane => {
      if (plane.index === 0) {
        return plane.equipment.proficiency.criticalPowerModifier / 100
      }
      return plane.equipment.proficiency.criticalPowerModifier / 200
    })
  }

  public static getCriticalModifier = (ship: IShip) => {
    const shellingType = Shelling.getShellingType(ship)
    if (shellingType === 'Shelling') {
      return 1.5
    }
    return 1.5 * Shelling.calcProficiencyModifier(ship)
  }

  public static calcBasePower = (ship: IShip, isAntiInstallation = false) => {
    const shellingType = Shelling.getShellingType(ship)
    const { stats, totalEquipmentStats } = ship
    let basePower = 5 + stats.firepower + totalEquipmentStats(equip => equip.improvement.shellingPowerModifier)
    if (shellingType === 'CarrierShelling') {
      const bombing = totalEquipmentStats('bombing')
      const torpedo = isAntiInstallation ? 0 : totalEquipmentStats('torpedo')
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
    const { health } = ship
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

    let postCap = Math.floor(softcap(Shelling.cap, preCap)) * specialAttackModifier
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
