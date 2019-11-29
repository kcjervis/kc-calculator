import NightCombatSpecialAttack from "./NightCombatSpecialAttack"
import { ShipInformation } from "../../types"

import ShipNightAttackStatus from "./ShipNightAttackStatus"
import Damage from "../Damage"
import NightAttackAccuracy from "./NightAttackAccuracy"
import { createHitRate } from "../../formulas"

export default class NightAttack {
  public static criticalRateConstant = 1.5
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public specialAttack?: NightCombatSpecialAttack,
    public isCritical?: boolean,

    public nightContactModifier = 0,
    public eventMapModifier = 1,
    public remainingAmmoModifier = 1
  ) {}

  get attackerNightAttackStatus() {
    return new ShipNightAttackStatus(this.attacker.ship)
  }

  get contactModifier() {
    if (this.nightContactModifier === 5) {
      return { power: 5, accuracy: 1.1, criticalRate: 1.57 }
    }
    return { power: 0, accuracy: 1, criticalRate: NightAttack.criticalRateConstant }
  }

  get accuracy() {
    const { attacker, specialAttack, contactModifier } = this
    const { formation, role } = attacker
    const { stats, level, totalEquipmentStats, morale, shipType, hasGear } = attacker.ship

    const improvementModifier = totalEquipmentStats(gear => gear.improvement.nightAttackAccuracyModifier)

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.accuracy

    const starshellModifier = undefined

    const specialAttackModifier = specialAttack && specialAttack.modifier.accuracy
    const searchlightModifier = undefined

    let heavyCruiserBonus = 0
    if (shipType.isHeavyCruiserClass) {
      // 20.3
      if (hasGear(6)) {
        heavyCruiserBonus = 10
      }
      // 2号砲3号砲補正
      if (hasGear(90) || hasGear(50)) {
        heavyCruiserBonus = 15
      }
    }

    return new NightAttackAccuracy({
      starshellModifier,
      contactModifier: contactModifier.accuracy,
      level,
      luck: stats.luck,
      equipmentAccuracy: totalEquipmentStats("accuracy"),
      improvementModifier,

      formationModifier,
      moraleModifier: morale.getAccuracyModifier("night"),
      specialAttackModifier,
      searchlightModifier,
      fitGunBonus: heavyCruiserBonus
    })
  }

  get power() {
    const { attacker, defender, isCritical, attackerNightAttackStatus, specialAttack, eventMapModifier } = this
    const { role, formation } = attacker

    return attackerNightAttackStatus.calcPower({
      role,
      nightContactModifier: this.contactModifier.power,
      formation,
      specialAttack,
      isCritical,
      target: defender.ship
    })
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).nightBattle.evasion
    const shipTypeMod = ship.shipType.isHeavyCruiserClass ? 5 : 0
    return ship.calcEvasionValue(formationModifier, shipTypeMod)
  }

  // 夜戦熟練度命中補正ってどうなってるの?
  get hitRate() {
    const { accuracy, defender, defenderEvasionValue, contactModifier } = this
    const moraleModifier = defender.ship.morale.evasionModifier

    return createHitRate({
      accuracy: accuracy.value,
      evasion: defenderEvasionValue,
      moraleModifier,
      criticalRateConstant: contactModifier.criticalRate
    })
  }

  get defensePower() {
    return this.defender.ship.getDefensePower()
  }

  get damage() {
    const { power, defensePower, remainingAmmoModifier, defender } = this
    return new Damage(power.value, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
