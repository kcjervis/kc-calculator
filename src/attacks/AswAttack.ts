import { ShipId } from "@jervis/data"
import { ShipInformation } from "../types"
import { IShip, IGear } from "../objects"
import { Asw, FunctionalModifier, createCriticalFm, createHitRate } from "../formulas"
import { Engagement, Formation } from "../constants"
import { Damage } from "../Battle"
import AswAttackStatus, { isAswAircraft, isAswGear, getAswType } from "./AswAttackStatus"
import { AttackPowerModifierRecord } from "../data/SpecialEnemyModifier"

export const isPossible = (attacker: IShip, defender: IShip) => {
  if (!defender.shipType.isSubmarineClass) {
    return false
  }
  if (getAswType(attacker) === "None") {
    return false
  }
  return true
}

export type AswAttackParams = {
  attacker: ShipInformation
  defender: ShipInformation
  engagement: Engagement
  isCritical: boolean

  isOpeningAaw?: boolean
  isNight?: boolean
  remainingAmmoModifier?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
}

export default class AswAttack {
  public static readonly cap = 150
  public static readonly criticalRateConstant = 1.1

  public static isPossible = isPossible

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public isOpeningAaw: boolean
  public isNight: boolean
  public remainingAmmoModifier: number
  public optionalPowerModifiers?: AttackPowerModifierRecord

  private attackerStatus: AswAttackStatus

  constructor({
    attacker,
    defender,
    engagement,
    isCritical = false,
    isOpeningAaw = false,
    isNight = false,
    remainingAmmoModifier = 1,
    optionalPowerModifiers
  }: AswAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.engagement = engagement
    this.isCritical = isCritical
    this.isOpeningAaw = isOpeningAaw
    this.isNight = isNight
    this.remainingAmmoModifier = remainingAmmoModifier
    this.optionalPowerModifiers = optionalPowerModifiers

    this.attackerStatus = new AswAttackStatus(attacker.ship, isNight)
  }

  private getFormationModifiers = () => {
    const { attacker, defender } = this
    const { power, accuracy } = attacker.formation.getModifiersWithRole(attacker.role).asw
    const { evasion } = defender.formation.getModifiersWithRole(defender.role).asw

    const modifiers = { power, accuracy, evasion }

    if (Formation.isIneffective(attacker.formation, defender.formation)) {
      return { ...modifiers, accuracy: 1 }
    }
    return modifiers
  }

  get power() {
    const { isCritical, isOpeningAaw, optionalPowerModifiers } = this
    const formationModifier = this.getFormationModifiers().power
    const engagementModifier = this.engagement.modifier

    return this.attackerStatus.createPower({
      formationModifier,
      engagementModifier,
      isCritical,
      isOpeningAaw,
      optionalModifiers: optionalPowerModifiers
    })
  }

  get accuracy() {
    const { ship } = this.attacker
    const { luck, level } = ship.nakedStats

    const aswEquipmentModifier = this.attackerStatus.aswEquipmentAccuracyModifier

    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.aswAccuracyModifier)

    const moraleModifier = ship.morale.getAccuracyModifier("asw")

    const formationModifier = this.getFormationModifiers().accuracy
    return Asw.calcAccuracy({
      luck,
      level,
      aswEquipmentModifier,
      improvementModifier,
      moraleModifier,
      formationModifier
    })
  }

  get evasion() {
    const formationModifier = this.getFormationModifiers().evasion
    return this.defender.ship.calcEvasionValue(formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, evasion } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    const criticalRateConstant = AswAttack.criticalRateConstant
    return createHitRate({ accuracy, evasion, moraleModifier, criticalRateConstant })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier, attackerStatus } = this
    const defensePower = defender.ship.getDefensePower()
    const { armorPenetration } = attackerStatus
    return new Damage(
      power.postcap,
      defensePower,
      defender.ship.health.currentHp,
      remainingAmmoModifier,
      armorPenetration
    )
  }
}
