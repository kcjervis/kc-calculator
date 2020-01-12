import { createHitRate } from "../formulas"
import { ShipInformation } from "../types"
import { Engagement } from "../constants"
import { IShip } from "../objects"
import { getTorpedoFleetFactor } from "./FleetFactor"
import { AttackPowerModifierRecord } from "../common"
import ShipTorpedoAttackCalculator from "./ShipTorpedoAttackCalculator"
import Damage from "./Damage"

type TorpedoAttackParams = {
  attacker: ShipInformation
  defender: ShipInformation
  engagement: Engagement
  isCritical: boolean

  remainingAmmoModifier?: number
  innateTorpedoAccuracy?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
}

const isPossible = (attacker: IShip, defender: IShip) => {
  if (attacker.nakedStats.torpedo === 0) {
    return false
  }
  if (defender.isInstallation) {
    return false
  }
  return true
}

export default class TorpedoAttack {
  public static readonly cap = 150
  public static readonly criticalRateMultiplier = 1.5

  public static isPossible = isPossible

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public remainingAmmoModifier: number
  public innateTorpedoAccuracy: number
  public optionalPowerModifiers?: AttackPowerModifierRecord

  private attackCalculator: ShipTorpedoAttackCalculator

  constructor({
    attacker,
    defender,
    engagement,
    isCritical = false,
    remainingAmmoModifier = 1,
    innateTorpedoAccuracy = 0,
    optionalPowerModifiers
  }: TorpedoAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.engagement = engagement
    this.isCritical = isCritical
    this.remainingAmmoModifier = remainingAmmoModifier
    this.innateTorpedoAccuracy = innateTorpedoAccuracy
    this.optionalPowerModifiers = optionalPowerModifiers

    this.attackCalculator = ShipTorpedoAttackCalculator.fromShip(attacker.ship)
  }

  private getFormationModifiers = () => {
    const { attacker, defender } = this
    return {
      attacker: attacker.formation.getModifiersWithRole(attacker.role).torpedo,
      defender: defender.formation.getModifiersWithRole(defender.role).torpedo
    }
  }

  get power() {
    const { isCritical, optionalPowerModifiers } = this
    const fleetFactor = getTorpedoFleetFactor(this.attacker, this.defender)
    const formationModifier = this.getFormationModifiers().attacker.power
    const engagementModifier = this.engagement.modifier

    return this.attackCalculator.calcPower({
      fleetFactor,
      formationModifier,
      engagementModifier,
      isCritical,
      optionalModifiers: optionalPowerModifiers
    })
  }

  get accuracy() {
    const powerModifier = Math.floor(0.2 * this.power.preCritical)
    const formationModifier = this.getFormationModifiers().attacker.accuracy
    const { innateTorpedoAccuracy } = this

    return this.attackCalculator.calcAccuracy({
      formationModifier,
      powerModifier,
      innateTorpedoAccuracy
    })
  }

  get evasion() {
    const { ship } = this.defender
    const formationModifier = this.getFormationModifiers().defender.evasion
    const sonarImprovementBonus = ship.totalEquipmentStats(gear => {
      if (gear.is("Sonar") || gear.is("LargeSonar")) {
        return 0
      }
      return 1.5 * Math.sqrt(gear.star)
    })
    return ship.calcEvasionValue(formationModifier, sonarImprovementBonus)
  }

  get hitRate() {
    const { accuracy, defender, evasion } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    const { criticalRateMultiplier } = TorpedoAttack
    return createHitRate({ accuracy, evasion, moraleModifier, criticalRateMultiplier })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
