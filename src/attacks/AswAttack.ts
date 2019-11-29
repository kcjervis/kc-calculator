import { ShipId } from "@jervis/data"
import { ShipInformation } from "../types"
import { IShip, IGear } from "../objects"
import { Asw, FunctionalModifier, createCriticalFm, createHitRate } from "../formulas"
import { Engagement, Formation } from "../constants"
import { Damage } from "../Battle"
import AswAttackStatus, { isAswAircraft, isAswGear } from "./AswAttackStatus"

export const getAswType = (ship: IShip, isNight = false) => {
  if (isNight) {
    return ship.nakedStats.asw > 0 ? "DepthCharge" : "None"
  }

  if (
    ship.shipType.any(
      "AviationCruiser",
      "AviationBattleship",
      "SeaplaneTender",
      "LightAircraftCarrier",
      "AmphibiousAssaultShip"
    ) ||
    ShipId["速吸改"] === ship.shipId
  ) {
    const hasAswAircraft = ship.planes.some(plane => plane.slotSize > 0 && isAswAircraft(plane.gear))
    return hasAswAircraft ? "AircraftCarrier" : "None"
  }

  return ship.nakedStats.asw > 0 ? "DepthCharge" : "None"
}

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

  private attackerStatus: AswAttackStatus

  constructor({
    attacker,
    defender,
    engagement,
    isCritical = false,
    isOpeningAaw = false,
    isNight = false,
    remainingAmmoModifier = 1
  }: AswAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.engagement = engagement
    this.isCritical = isCritical
    this.isOpeningAaw = isOpeningAaw
    this.isNight = isNight
    this.remainingAmmoModifier = remainingAmmoModifier

    this.attackerStatus = new AswAttackStatus(attacker.ship, isNight)
  }

  private get type() {
    return this.attackerStatus.type
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

  private getAdditionalFm = (): FunctionalModifier | undefined => {
    const { type, isCritical, isOpeningAaw } = this
    if (!isCritical) {
      return undefined
    }

    if (isOpeningAaw || type !== "AircraftCarrier") {
      return createCriticalFm()
    }
    const { power } = this.attacker.ship.getNormalProficiencyModifiers()
    return createCriticalFm(power)
  }

  get power() {
    const additionalFm = this.getAdditionalFm()

    const formation = this.getFormationModifiers().power
    const engagement = this.engagement.modifier

    return this.attackerStatus.calcPower({ formation, engagement, additionalFm })
  }

  get accuracy() {
    const { ship } = this.attacker
    const { luck, level } = ship.nakedStats

    const aswEquipmentModifier = ship.totalEquipmentStats(gear => {
      if (gear.is("Sonar")) {
        return 2 * gear.asw
      }
      if (gear.is("AdditionalDepthCharge")) {
        return gear.asw
      }
      return 0
    })

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
