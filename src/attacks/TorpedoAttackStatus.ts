import { FunctionalModifier, createAttackPower, createHitRate } from "../formulas"
import { IShip } from "../objects"
import { AttackPowerModifierRecord } from "../data/SpecialEnemyModifier"

export default class TorpedoAttackStatus {
  constructor(private ship: IShip) {}

  get improvementModifier() {
    return this.ship.totalEquipmentStats(gear => gear.improvement.torpedoPowerModifier)
  }

  public createPower = (params: {
    fleetFactor: number
    formationModifier: number
    engagementModifier: number
    isCritical: boolean
    optionalModifiers?: AttackPowerModifierRecord
  }) => {
    const { fleetFactor, formationModifier, engagementModifier, optionalModifiers = {} } = params
    const { ship, improvementModifier } = this
    const { torpedo } = ship.stats

    const healthModifier = ship.health.torpedoPowerModifire
    const a14 = formationModifier * engagementModifier * healthModifier
    const modifiers = AttackPowerModifierRecord.compose({ a14 }, optionalModifiers)

    const basic = torpedo + improvementModifier + fleetFactor
    const cap = 150
    const preCriticalPower = createAttackPower({ basic, cap, modifiers })
    const preCritical = preCriticalPower.postcap

    if (!params.isCritical) {
      return { ...preCriticalPower, preCritical }
    }

    const postcap = Math.floor(preCriticalPower.postcap * 1.5)
    return { ...preCriticalPower, preCritical, postcap }
  }
}
