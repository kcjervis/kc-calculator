import { ShipInformation, BattleState, ShipRole } from "../types"

import Damage from "./Damage"
import { createHitRate } from "../formulas"
import { Formation } from "../common"
import ShipShellingSupportCalculator from "./ShipShellingSupportCalculator"

type ShellingSupportAttackParams = {
  battleState: BattleState
  attacker: ShipInformation
  defender: ShipInformation
  isCritical?: boolean
  remainingAmmoModifier?: number
}

export default class ShellingSupportAttack {
  // 改式だと1.1 実際いくつかわからない
  public static criticalRateMultiplier = 1.1

  private battleState: BattleState
  private attacker: ShipInformation
  private defender: ShipInformation
  private isCritical?: boolean
  private remainingAmmoModifier: number

  private attackCalculator: ShipShellingSupportCalculator

  constructor({ battleState, attacker, defender, isCritical, remainingAmmoModifier = 1 }: ShellingSupportAttackParams) {
    this.battleState = battleState
    this.attacker = attacker
    this.defender = defender
    this.isCritical = isCritical
    this.remainingAmmoModifier = remainingAmmoModifier

    this.attackCalculator = new ShipShellingSupportCalculator(attacker.ship)
  }

  get power() {
    const { battleState, attacker, defender, isCritical } = this

    const { engagement } = battleState
    const { formation } = attacker

    const formationModifier = formation.shellingSupportModifiers.power
    const engagementModifier = engagement.modifier
    const isAntiInstallation = defender.ship.isInstallation

    return this.attackCalculator.calcPower({
      formationModifier,
      engagementModifier,
      isCritical,
      isAntiInstallation
    })
  }

  get accuracy() {
    const formationModifier = this.attacker.formation.shellingSupportModifiers.accuracy

    return this.attackCalculator.calcAccuracy({ formationModifier })
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).shelling.evasion
    return ship.calcEvasionValue(formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    return createHitRate({
      accuracy: accuracy,
      evasion: defenderEvasionValue,
      moraleModifier,
      criticalRateMultiplier: ShellingSupportAttack.criticalRateMultiplier
    })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
