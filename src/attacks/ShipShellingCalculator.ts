import { IShip } from "../objects"
import { getApShellModifiers } from "../formulas"
import {
  AttackPowerModifierRecord,
  composeAttackPowerModifierRecord,
  createAttackPower,
  FunctionalModifier,
  createCriticalFm
} from "../common"
import { DayCombatSpecialAttack } from "../Battle"

export const getShellingType = (ship: IShip) => {
  const { shipType, shipClass, isInstallation, hasGear } = ship
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

export default class ShipShellingCalculator {
  constructor(private ship: IShip) {}

  public get type() {
    return getShellingType(this.ship)
  }

  public getProficiencyModifiers = (isCarrierSpecialAttack = false) => {
    if (this.type === "Shelling") {
      return { power: 1, hitRate: 0, criticalRate: 0 }
    }

    if (isCarrierSpecialAttack) {
      return this.ship.getSpecialProficiencyModifiers()
    }
    return this.ship.getNormalProficiencyModifiers()
  }

  private get apShellModifiers() {
    const { hasGear } = this.ship
    return getApShellModifiers({
      hasMainGun: hasGear("MainGun"),
      hasArmorPiercingShell: hasGear("ArmorPiercingShell"),
      hasSecondaryGun: hasGear("SecondaryGun"),
      hasRader: hasGear("Radar")
    })
  }

  private get apShellFm(): FunctionalModifier {
    const apShellModifier = this.apShellModifiers.power
    return value => Math.floor(value * apShellModifier)
  }

  private calcBasicPower = (additive = 0) => {
    const { ship } = this
    const { firepower } = ship.stats
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.shellingPowerModifier)
    return 5 + firepower + improvementModifier + additive
  }

  private getCarrierShellingFm = (isAntiInstallation = false): FunctionalModifier | undefined => {
    const { ship, type } = this
    if (type === "Shelling") {
      return
    }

    const torpedo = isAntiInstallation ? 0 : ship.stats.torpedo

    const bombing = isAntiInstallation
      ? ship.totalEquipmentStats(gear => (gear.is("AntiInstallationBomber") ? gear.bombing : 0))
      : ship.totalEquipmentStats("bombing")

    const airPower = Math.floor(Math.floor(1.3 * bombing) + torpedo) + 15
    return value => 25 + Math.floor((value + airPower) * 1.5)
  }

  public calcPower = (params: {
    fleetFactor: number
    formationModifier: number
    engagementModifier: number
    modifiers: AttackPowerModifierRecord

    isCritical?: boolean
    isAntiInstallation?: boolean
    isArmorPiercing?: boolean

    specialAttack?: DayCombatSpecialAttack
  }) => {
    const {
      fleetFactor,
      formationModifier,
      engagementModifier,

      isCritical,
      isAntiInstallation,
      isArmorPiercing,

      specialAttack
    } = params
    const basic = this.calcBasicPower(fleetFactor)
    const cap = 180

    const { ship } = this

    const healthModifier = ship.health.shellingPowerModifier
    const cruiserFitBonus = ship.getCruiserFitBonus()

    const specialAttackModifier = specialAttack ? specialAttack.modifier.power : 1
    const proficiencyModifier = this.getProficiencyModifiers(specialAttack?.isCarrierSpecialAttack).power

    const a14 = formationModifier * engagementModifier * healthModifier
    const b14 = cruiserFitBonus
    const a11 = specialAttackModifier
    let modifiers: AttackPowerModifierRecord = { a14, b14, a11 }
    if (params.modifiers) {
      modifiers = composeAttackPowerModifierRecord(modifiers, params.modifiers)
    }

    const fm14prev = this.getCarrierShellingFm(isAntiInstallation)

    const fm11next: FunctionalModifier = value => {
      if (isArmorPiercing) {
        value = this.apShellFm(value)
      }
      if (isCritical) {
        value = createCriticalFm(proficiencyModifier)(value)
      }
      return value
    }

    return createAttackPower({ basic, cap, modifiers, fm14prev, fm11next })
  }

  private get accuracyShipFactors() {
    const { ship } = this
    const { shipAccuracy } = ship
    return {
      shipAccuracy,
      equipmentAccuracy: ship.totalEquipmentStats("accuracy"),
      improvementModifier: ship.totalEquipmentStats(gear => gear.improvement.shellingAccuracyModifier),
      moraleModifier: ship.morale.getAccuracyModifier("shelling")
    }
  }

  public calcAccuracy = (params: {
    fleetFactor: number
    formationModifier: number
    specialAttackModifier: number
    isArmorPiercing: boolean
    fitGunBonus: number
  }) => {
    const { shipAccuracy, equipmentAccuracy, improvementModifier, moraleModifier } = this.accuracyShipFactors
    const { fleetFactor, formationModifier, specialAttackModifier, isArmorPiercing, fitGunBonus } = params
    let apShellModifier = 1
    if (isArmorPiercing) {
      apShellModifier = this.apShellModifiers.accuracy
    }

    const base = Math.floor(fleetFactor + shipAccuracy + equipmentAccuracy + improvementModifier)
    return Math.floor(
      (base * formationModifier * moraleModifier + fitGunBonus) * specialAttackModifier * apShellModifier
    )
  }
}
