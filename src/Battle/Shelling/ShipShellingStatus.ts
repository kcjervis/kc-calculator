import { Formation, Engagement } from "../../constants"
import { IShip } from "../../objects"
import { sumBy } from "lodash-es"
import DayCombatSpecialAttack from "./DayCombatSpecialAttack"
import { ShipRole, ShellingType, ShellingPowerFactors, ShellingAccuracyFactors, InstallationType } from "../../types"
import ShellingPower from "./ShellingPower"
import ShipAntiInstallationStatus from "../../objects/Ship/ShipAntiInstallationStatus"
import ShellingAccuracy from "./ShellingAccuracy"

type ShipShellingPowerOptions = Partial<{
  role: ShipRole
  formation: Formation
  engagement: Engagement
  combinedFleetFactor: number
  specialAttack: DayCombatSpecialAttack
  isArmorPiercing: boolean
  installationType: InstallationType
  isCritical: boolean
  eventMapModifier: number
}>

/**
 * 巡洋艦砲フィット補正
 *
 * 軽巡軽量砲補正と伊重巡フィット砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#軽巡軽量砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#伊重巡フィット砲補正
 */
export const calcCruiserFitBonus = (ship: IShip) => {
  let fitBonus = 0
  if (ship.shipType.any("LightCruiser", "TorpedoCruiser", "TrainingCruiser")) {
    const singleGunCount = ship.countGear(gear => [4, 11].includes(gear.masterId))
    const twinGunCount = ship.countGear(gear => [65, 119, 139].includes(gear.masterId))
    fitBonus += Math.sqrt(singleGunCount) + 2 * Math.sqrt(twinGunCount)
  }
  if (ship.shipClass.is("ZaraClass")) {
    fitBonus += Math.sqrt(ship.countGear(162))
  }
  return fitBonus
}

/**
 * 熟練度補正
 * 戦爆連合は適当
 */
export const getProficiencyModifier = (ship: IShip, specialAttack?: DayCombatSpecialAttack) => {
  const modifier = { power: 1, hitRate: 0, criticalRate: 0 }
  if (specialAttack && specialAttack.isCarrierSpecialAttack) {
    const planes = ship.planes.filter(plane => plane.participatesInCarrierShelling)
    if (planes.some(plane => plane.index === 0)) {
      modifier.power = 1.25
    } else {
      modifier.power = 1.106
    }
    return modifier
  }

  const planes = ship.planes.filter(
    plane => (plane.slotSize > 0 && plane.is("DiveBomber")) || plane.is("TorpedoBomber") || plane.is("LargeFlyingBoat")
  )
  modifier.power =
    1 +
    sumBy(planes, plane => {
      if (plane.index === 0) {
        return plane.gear.proficiency.criticalPowerModifier / 100
      }
      return plane.gear.proficiency.criticalPowerModifier / 200
    })

  const average = sumBy(planes, plane => plane.gear.proficiency.internal) / planes.length
  let averageModifierA = 0
  let averageModifierB = 0
  if (average >= 10) {
    averageModifierA = Math.floor(Math.sqrt(0.1 * average))
  }
  if (average >= 25) {
    averageModifierB = 1
  }
  if (average >= 40) {
    averageModifierB = 2
  }
  if (average >= 55) {
    averageModifierB = 3
  }
  if (average >= 70) {
    averageModifierB = 4
  }
  if (average >= 80) {
    averageModifierB = 6
  }
  if (average >= 100) {
    averageModifierB = 9
  }
  modifier.hitRate = averageModifierA + averageModifierB

  modifier.criticalRate = sumBy(planes, plane => {
    const { internal, level } = plane.gear.proficiency
    let levelBonus = 0
    if (level === 7) {
      levelBonus = 3
    }
    return (Math.sqrt(Math.sqrt(0.1 * internal)) + levelBonus) / 100
  })

  return modifier
}

export default class ShipShellingStatus {
  public antiInstallationStatus: ShipAntiInstallationStatus

  constructor(private ship: IShip) {
    this.antiInstallationStatus = new ShipAntiInstallationStatus(ship)
  }

  get shellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasGear } = this.ship
    if (shipType.isAircraftCarrierClass) {
      return "CarrierShelling"
    }

    if (!shipClass.is("RevisedKazahayaClass") && !isInstallation) {
      return "Shelling"
    }

    if (hasGear("DiveBomber") || hasGear("TorpedoBomber")) {
      return "CarrierShelling"
    }

    return "Shelling"
  }

  get firepower() {
    return this.ship.stats.firepower
  }

  get torpedo() {
    return this.ship.stats.torpedo
  }

  get bombing() {
    return this.ship.totalEquipmentStats("bombing")
  }

  get improvementModifier() {
    return this.ship.totalEquipmentStats(gear => gear.improvement.shellingPowerModifier)
  }

  get cruiserFitBonus() {
    return calcCruiserFitBonus(this.ship)
  }

  get healthModifier() {
    return this.ship.health.shellingPowerModifier
  }

  get apShellModifiers() {
    const { ship } = this
    const modifier = { power: 1, accuracy: 1 }

    const { hasGear } = ship

    if (!hasGear(gear => gear.is("ArmorPiercingShell")) || !hasGear(gear => gear.is("MainGun"))) {
      return modifier
    }

    const hasSecondaryGun = hasGear(gear => gear.is("SecondaryGun"))
    const hasRader = hasGear(gear => gear.is("Radar"))

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

  public calcAccuracy = (options: {
    fitGunBonus: number
    combinedFleetFactor: number
    formationModifier: number
    isArmorPiercing: boolean
    specialAttack?: DayCombatSpecialAttack
  }) => {
    const { ship } = this
    const { level, stats } = ship
    const { luck } = stats
    const { fitGunBonus, combinedFleetFactor, formationModifier, specialAttack, isArmorPiercing } = options
    const equipmentAccuracy = ship.totalEquipmentStats("accuracy")
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.shellingAccuracyModifier)

    const moraleModifier = ship.morale.shellingAccuracyModifier
    const specialAttackModifier = specialAttack ? specialAttack.modifier.accuracy : 1
    const apShellModifier = isArmorPiercing ? this.apShellModifiers.accuracy : 1
    const factors: ShellingAccuracyFactors = {
      combinedFleetFactor,
      level,
      luck,
      equipmentAccuracy,
      improvementModifier,
      moraleModifier,
      formationModifier,
      fitGunBonus,
      specialAttackModifier,
      apShellModifier
    }
    return new ShellingAccuracy(factors)
  }
}
