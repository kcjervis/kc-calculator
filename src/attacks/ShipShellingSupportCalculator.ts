import { IShip } from "../objects"
import { AttackPowerModifierRecord, createAttackPower, FunctionalModifier, createCriticalFm } from "../common"
import { getShellingType } from "./ShipShellingCalculator"

export default class ShipShellingSupportCalculator {
  constructor(private ship: IShip) {}

  private get type() {
    return getShellingType(this.ship)
  }

  private getCarrierShellingFm = (isAntiInstallation = false): FunctionalModifier | undefined => {
    const { ship, type } = this
    if (type === "Shelling") {
      return
    }

    const torpedo = isAntiInstallation ? 0 : ship.totalEquipmentStats("torpedo")
    const bombing = isAntiInstallation
      ? ship.totalEquipmentStats(gear => (gear.is("AntiInstallationBomber") ? gear.bombing : 0))
      : ship.totalEquipmentStats("bombing")

    const airPower = Math.floor(Math.floor(1.3 * bombing) + torpedo) + 15
    return value => 25 + Math.floor((value + airPower) * 1.5)
  }

  public calcPower = (params: {
    formationModifier: number
    engagementModifier: number

    isCritical?: boolean
    isAntiInstallation?: boolean
  }) => {
    const { ship } = this
    const { formationModifier, engagementModifier, isCritical, isAntiInstallation } = params
    const basic = 4 + ship.stats.firepower
    const cap = 150

    const healthModifier = ship.health.shellingPowerModifier
    const a14 = formationModifier * engagementModifier * healthModifier
    const modifiers: AttackPowerModifierRecord = { a14 }

    const fm14prev = this.getCarrierShellingFm(isAntiInstallation)
    const fm11next = isCritical ? createCriticalFm() : undefined

    return createAttackPower({ basic, cap, modifiers, fm14prev, fm11next })
  }

  private get accuracyShipFactors() {
    const { ship } = this
    const { shipAccuracy } = ship
    return {
      shipAccuracy,
      equipmentAccuracy: ship.totalEquipmentStats("accuracy"),
      moraleModifier: ship.morale.getAccuracyModifier("shelling")
    }
  }

  public calcAccuracy = (params: { formationModifier: number }) => {
    const { shipAccuracy, equipmentAccuracy, moraleModifier } = this.accuracyShipFactors
    const { formationModifier } = params

    const base = Math.floor(64 + shipAccuracy + equipmentAccuracy)
    return Math.floor(base * formationModifier * moraleModifier)
  }
}
