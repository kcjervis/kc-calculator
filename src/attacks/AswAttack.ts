import { ShipInformation } from "../types"
import { createHitRate } from "../formulas"
import { Engagement, Formation, AttackPowerModifierRecord } from "../common"
import Damage from "./Damage"
import ShipAswCalculator, { AswTime } from "./ShipAswCalculator"

export type AswAttackParams = {
  attacker: ShipInformation
  defender: ShipInformation
  engagement: Engagement
  isCritical: boolean

  time?: AswTime
  remainingAmmoModifier?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
}

export default class AswAttack {
  public static readonly cap = 150
  public static readonly criticalRateMultiplier = 1.1

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public time: AswTime
  public remainingAmmoModifier: number
  public optionalPowerModifiers?: AttackPowerModifierRecord

  private attackCalculator: ShipAswCalculator

  constructor({
    attacker,
    defender,
    engagement,
    isCritical = false,
    time = "Day",
    remainingAmmoModifier = 1,
    optionalPowerModifiers
  }: AswAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.engagement = engagement
    this.isCritical = isCritical
    this.time = time
    this.remainingAmmoModifier = remainingAmmoModifier
    this.optionalPowerModifiers = optionalPowerModifiers

    this.attackCalculator = ShipAswCalculator.fromShip(attacker.ship, time)
  }

  public isPossible = () => {
    const { defender, attackCalculator } = this
    if (!defender.ship.shipType.isSubmarineClass) {
      return false
    }

    if (attackCalculator.type === "None") {
      return false
    }

    return true
  }

  private getFormationModifiers = () => {
    const { attacker, defender } = this
    const { power, accuracy } = attacker.formation.getModifiers(attacker.role).asw
    const { evasion } = defender.formation.getModifiers(defender.role).asw

    const modifiers = { power, accuracy, evasion }

    if (Formation.isIneffective(attacker.formation, defender.formation)) {
      return { ...modifiers, accuracy: 1 }
    }
    return modifiers
  }

  get power() {
    const { isCritical, optionalPowerModifiers } = this
    const formationModifier = this.getFormationModifiers().power
    const engagementModifier = this.engagement.modifier

    return this.attackCalculator.calcPower({
      formationModifier,
      engagementModifier,
      isCritical,
      optionalModifiers: optionalPowerModifiers
    })
  }

  get accuracy() {
    const formationModifier = this.getFormationModifiers().accuracy
    return this.attackCalculator.calcAccuracy({ formationModifier })
  }

  get evasion() {
    const formationModifier = this.getFormationModifiers().evasion
    return this.defender.ship.calcEvasionValue(formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, evasion } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    const criticalRateMultiplier = AswAttack.criticalRateMultiplier
    return createHitRate({ accuracy, evasion, moraleModifier, criticalRateMultiplier })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    const { armorPenetration } = this.attackCalculator
    return new Damage(
      power.postcap,
      defensePower,
      defender.ship.health.currentHp,
      remainingAmmoModifier,
      armorPenetration
    )
  }
}
