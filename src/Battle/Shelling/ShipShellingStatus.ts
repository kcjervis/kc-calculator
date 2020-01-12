import { Formation, Engagement } from "../../constants"
import { IShip } from "../../objects"
import { sumBy } from "lodash-es"
import DayCombatSpecialAttack from "./DayCombatSpecialAttack"
import { ShipRole, ShellingType, ShellingPowerFactors, ShellingAccuracyFactors } from "../../types"
import ShellingPower from "./ShellingPower"
import ShellingAccuracy from "./ShellingAccuracy"

type ShipShellingPowerOptions = Partial<{
  role: ShipRole
  formation: Formation
  engagement: Engagement
  combinedFleetFactor: number
  specialAttack: DayCombatSpecialAttack
  isArmorPiercing: boolean
  isCritical: boolean
  eventMapModifier: number
}> & {
  target: IShip
}

/**
 * 熟練度補正
 * 戦爆連合は適当
 */
export const getProficiencyModifier = (ship: IShip, specialAttack?: DayCombatSpecialAttack) => {
  const stats = ship.getShellingStats()
  if (specialAttack && specialAttack.isCarrierSpecialAttack) {
    return stats.specialProficiencyModifiers
  }
  return stats.normalProficiencyModifiers
}

export default class ShipShellingStatus {
  constructor(private ship: IShip) {}

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
    return this.ship.getCruiserFitBonus()
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

  public calcPower = (options: ShipShellingPowerOptions) => {
    const {
      role = "Main",
      isCritical = false,
      formation = Formation.LineAhead,
      engagement = Engagement.Parallel,
      combinedFleetFactor = 0,
      eventMapModifier = 1,
      specialAttack,
      isArmorPiercing = false,
      target
    } = options

    const { shellingType, firepower, torpedo, bombing, improvementModifier, cruiserFitBonus, healthModifier } = this

    const formationModifier = formation.getModifiersWithRole(role).shelling.power
    const engagementModifier = engagement.modifier

    const criticalModifier = isCritical ? 1.5 : 1

    const specialAttackModifier = specialAttack ? specialAttack.modifier.power : 1
    const apShellModifier = isArmorPiercing ? this.apShellModifiers.power : 1

    const antiInstallationModifiers = this.ship.getAntiInstallationModifier(target)
    const isAntiInstallationWarfare = target.isInstallation

    const effectiveBombing = isAntiInstallationWarfare
      ? this.ship.totalEquipmentStats(gear => (gear.is("AntiInstallationBomber") ? gear.bombing : 0))
      : bombing

    const effectivenessMultiplicative = antiInstallationModifiers.a5
    const effectivenessAdditive = 0

    const factors: ShellingPowerFactors = {
      shellingType,
      combinedFleetFactor,
      firepower,
      torpedo: isAntiInstallationWarfare ? 0 : torpedo,
      bombing: effectiveBombing,
      improvementModifier,

      antiInstallationModifiers,
      formationModifier,
      engagementModifier,
      healthModifier,
      cruiserFitBonus,

      effectivenessMultiplicative,
      effectivenessAdditive,
      specialAttackModifier,
      apShellModifier,
      criticalModifier,
      proficiencyModifier: getProficiencyModifier(this.ship, specialAttack).power,
      eventMapModifier
    }

    return new ShellingPower(factors)
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

    const moraleModifier = ship.morale.getAccuracyModifier("shelling")
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
