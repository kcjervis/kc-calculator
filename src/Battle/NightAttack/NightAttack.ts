import { Formation, Engagement, FleetType, Side } from '../../constants'
import { IShip } from '../../objects'
import { sumBy } from 'lodash-es'
import NightCombatSpecialAttack from './NightCombatSpecialAttack'
import { ShipInformation, InstallationType } from '../../types'

import ShipNightAttackStatus from './ShipNightAttackStatus'
import Damage from '../Damage'
import DefensePower from '../DefensePower'
import NightAttackAccuracy from './NightAttackAccuracy'
import { calcHitRate } from '../Hit'
import { calcEvasionValue } from '../Evasion'

export default class NightAttack {
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public specialAttack?: NightCombatSpecialAttack,
    public isCritical?: boolean,

    public nightContactModifier = 0,
    public eventMapModifier = 1,
    public remainingAmmoModifier = 1,
    public manualInstallationType?: InstallationType
  ) {}

  get attackerNightAttackStatus() {
    return new ShipNightAttackStatus(this.attacker.ship)
  }

  get accuracy() {
    const { attacker, attackerNightAttackStatus, specialAttack } = this
    const { formation, role } = attacker
    const { stats, level, totalEquipmentStats, morale } = attacker.ship

    const starshellModifier = undefined
    const contactModifier = undefined

    const specialAttackModifier = specialAttack && specialAttack.modifier.accuracy
    const searchlightModifier = undefined

    return new NightAttackAccuracy({
      starshellModifier,
      contactModifier,
      level,
      luck: stats.luck,
      equipmentAccuracy: totalEquipmentStats('accuracy'),
      improvementModifier: attackerNightAttackStatus.improvementAccuracyModifier,

      formationModifier: formation.getModifiersWithRole(role).nightBattle.accuracy,
      moraleModifier: morale.nightBattleAccuracyModifier,
      specialAttackModifier,
      searchlightModifier,
      fitGunBonus: 0
    })
  }

  get power() {
    const {
      isCritical,
      manualInstallationType,
      attackerNightAttackStatus,
      specialAttack,
      nightContactModifier,
      eventMapModifier
    } = this
    const { role, formation } = this.attacker

    const installationType = manualInstallationType || this.defender.ship.installationType

    return attackerNightAttackStatus.calcPower({
      role,
      nightContactModifier,
      formation,
      installationType,
      specialAttack,
      isCritical,
      eventMapModifier
    })
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).nightBattle.evasion
    return calcEvasionValue(ship, formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue } = this
    const proficiencyModifier = 0
    const moraleModifier = defender.ship.morale.evasionModifier

    return calcHitRate(accuracy.value, defenderEvasionValue, moraleModifier, proficiencyModifier)
  }

  get defensePower() {
    const { stats, totalEquipmentStats } = this.defender.ship
    const defensePower = new DefensePower(
      stats.armor,
      totalEquipmentStats(equip => equip.improvement.defensePowerModifier)
    )
    return defensePower
  }

  get damage() {
    const { power, defensePower, remainingAmmoModifier, defender } = this
    return new Damage(power.value, defensePower, defender.ship.health.nowHp, remainingAmmoModifier)
  }
}
