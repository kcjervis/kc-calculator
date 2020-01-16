import { ShipInformation } from "../types"
import ShipNightAttackCalculator from "./ShipNightAttackCalculator"
import Damage from "./Damage"
import { createHitRate } from "../formulas"
import NightCombatSpecialAttack from "./NightCombatSpecialAttack"
import { GearId } from "@jervis/data"
import { AttackPowerModifierRecord, composeAttackPowerModifierRecord } from "../common"

type NightAttackParams = {
  attacker: ShipInformation
  defender: ShipInformation
  specialAttack?: NightCombatSpecialAttack
  isCritical?: boolean
  starshell: boolean
  searchlight: boolean
  nightContactModifier?: number
  remainingAmmoModifier?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
}

export default class NightAttack {
  public static criticalRateMultiplier = 1.5

  private attacker: ShipInformation
  private defender: ShipInformation
  private specialAttack?: NightCombatSpecialAttack
  private isCritical?: boolean

  private starshell: boolean
  private searchlight: boolean
  private nightContactModifier?: number
  private remainingAmmoModifier?: number
  private optionalPowerModifiers?: AttackPowerModifierRecord

  private attackCalculator: ShipNightAttackCalculator

  constructor({
    attacker,
    defender,
    specialAttack,
    isCritical,
    starshell,
    searchlight,
    nightContactModifier,
    remainingAmmoModifier,
    optionalPowerModifiers
  }: NightAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.specialAttack = specialAttack
    this.isCritical = isCritical

    this.starshell = starshell
    this.searchlight = searchlight
    this.nightContactModifier = nightContactModifier

    this.remainingAmmoModifier = remainingAmmoModifier
    this.optionalPowerModifiers = optionalPowerModifiers

    this.attackCalculator = new ShipNightAttackCalculator(attacker.ship)
  }

  get contactModifiers() {
    if (this.nightContactModifier === 5) {
      return { power: 5, accuracy: 1.1, criticalRate: 1.57 }
    }
    return { power: 0, accuracy: 1, criticalRate: NightAttack.criticalRateMultiplier }
  }

  get accuracy() {
    const { attacker, specialAttack, starshell, searchlight } = this
    const { formation, role } = attacker

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.accuracy

    const specialAttackModifier = specialAttack?.modifier.accuracy

    const contactModifier = this.contactModifiers.accuracy
    const starshellModifier = starshell ? 5 : 0
    const searchlightModifier = searchlight ? 7 : 0

    return this.attackCalculator.calcAccuracy({
      starshellModifier,
      contactModifier,
      searchlightModifier,
      formationModifier,
      specialAttackModifier
    })
  }

  private get typeDModifier() {
    const { attacker, specialAttack } = this

    if (!specialAttack?.isDestroyerCutin) {
      return 1
    }

    const typeDCount = attacker.ship.countGear(GearId["12.7cm連装砲D型改二"])
    if (typeDCount === 0) {
      return 1
    }
    if (typeDCount === 1) {
      return 1.25
    }
    return 1.4
  }

  get power() {
    const { attacker, defender, isCritical, specialAttack, typeDModifier, optionalPowerModifiers } = this
    const { role, formation } = attacker

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.power

    let specialAttackModifier = 1
    if (specialAttack) {
      specialAttackModifier = specialAttack.modifier.power * typeDModifier
    }

    const isAntiInstallation = defender.ship.isInstallation
    const specialEnemyModifiers = attacker.ship.getSpecialEnemyModifiers(defender.ship)
    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalPowerModifiers)

    return this.attackCalculator.calcPower({
      nightContactModifier: this.contactModifiers.power,
      formationModifier,
      specialAttackModifier,
      isCritical,
      isAntiInstallation,
      modifiers
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
    const { accuracy, defender, defenderEvasionValue, contactModifiers } = this
    const moraleModifier = defender.ship.morale.evasionModifier

    return createHitRate({
      accuracy,
      evasion: defenderEvasionValue,
      moraleModifier,
      criticalRateMultiplier: contactModifiers.criticalRate
    })
  }

  get defensePower() {
    return this.defender.ship.getDefensePower()
  }

  get damage() {
    const { power, defensePower, remainingAmmoModifier, defender } = this
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
