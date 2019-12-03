import { FunctionalModifier, createHitRate } from "../formulas"
import { ShipInformation } from "../types"
import { Engagement } from "../constants"
import { Damage } from "../Battle"
import { IShip } from "../objects"
import TorpedoAttackStatus from "./TorpedoAttackStatus"
import { getTorpedoFleetFactor } from "./FleetFactor"
import { AttackPowerModifierRecord } from "../data/SpecialEnemyModifier"

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
  public static readonly criticalRateConstant = 1.5

  public static isPossible = isPossible

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public remainingAmmoModifier: number
  public innateTorpedoAccuracy: number
  public optionalPowerModifiers?: AttackPowerModifierRecord

  private attackerStatus: TorpedoAttackStatus

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

    this.attackerStatus = new TorpedoAttackStatus(attacker.ship)
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

    return this.attackerStatus.createPower({
      fleetFactor,
      formationModifier,
      engagementModifier,
      isCritical,
      optionalModifiers: optionalPowerModifiers
    })
  }

  get accuracy() {
    const { ship } = this.attacker
    const { luck, level } = ship.nakedStats

    const constant = 85
    const shipAccuracy = 1.5 * Math.sqrt(luck) + 2 * Math.sqrt(level)
    const equipmentAccuracy = ship.totalEquipmentStats("accuracy")
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.torpedoAccuracyModifier)
    const powerModifier = Math.floor(0.2 * this.power.preCritical)
    const { innateTorpedoAccuracy } = this

    const formationModifier = this.getFormationModifiers().attacker.accuracy
    const moraleModifier = ship.morale.getAccuracyModifier("torpedo")

    return Math.floor(
      (constant + shipAccuracy + equipmentAccuracy + improvementModifier + powerModifier + innateTorpedoAccuracy) *
        formationModifier *
        moraleModifier
    )
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
    const criticalRateConstant = TorpedoAttack.criticalRateConstant
    return createHitRate({ accuracy, evasion, moraleModifier, criticalRateConstant })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
