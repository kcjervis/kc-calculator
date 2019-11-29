import { ShipId } from "@jervis/data"
import { ShipInformation } from "../types"
import { IShip, IGear } from "../objects"
import { Asw, FunctionalModifier, createCriticalFm, createHitRate } from "../formulas"
import { Engagement, Formation } from "../constants"
import { Damage } from "../Battle"

const isAswAircraft = ({ asw, category }: IGear) =>
  asw > 0 &&
  category.any(
    "CarrierBasedDiveBomber",
    "CarrierBasedTorpedoBomber",
    "SeaplaneBomber",
    "Autogyro",
    "AntiSubmarinePatrolAircraft",
    "LargeFlyingBoat"
  )

const isAswGear = (gear: IGear) =>
  gear.category.any(
    "CarrierBasedDiveBomber",
    "CarrierBasedTorpedoBomber",
    "SeaplaneBomber",
    "Sonar",
    "DepthCharge",
    "Autogyro",
    "AntiSubmarinePatrolAircraft",
    "LargeSonar"
  )

type AswAttackParams = {
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

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public isOpeningAaw: boolean
  public isNight: boolean
  public remainingAmmoModifier: number

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
  }

  private getAswType = () => {
    const { ship } = this.attacker

    if (this.isNight) {
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
      ShipId["速吸改"]
    ) {
      const hasAswAircraft = ship.planes.some(plane => plane.slotSize > 0 && isAswAircraft(plane.gear))
      return hasAswAircraft ? "AircraftCarrier" : "None"
    }

    return ship.nakedStats.asw > 0 ? "DepthCharge" : "None"
  }

  /**
   * @see https://twitter.com/KennethWWKK/status/1156195106837286912
   */
  public getSynergy = () => {
    const { hasGear } = this.attacker.ship
    let oldSynergy = 1
    let newSynergy = 1
    if ((hasGear("Sonar") || hasGear("LargeSonar")) && hasGear("DepthCharge")) {
      oldSynergy = 1.15
    }

    if (hasGear("AdditionalDepthCharge") && hasGear("DepthChargeProjector")) {
      if (hasGear("Sonar")) {
        newSynergy = 1.25
      } else {
        newSynergy = 1.1
      }
    }

    return oldSynergy * newSynergy
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
    const { getAswType, isCritical, isOpeningAaw } = this
    if (!isCritical) {
      return undefined
    }
    const type = getAswType()
    if (isOpeningAaw || type !== "AircraftCarrier") {
      return createCriticalFm()
    }
    const { power } = this.attacker.ship.getNormalProficiencyModifiers()
    return createCriticalFm(power)
  }

  get power() {
    const { ship } = this.attacker
    const equipmentAsw = ship.totalEquipmentStats(gear => (isAswGear(gear) ? gear.asw : 0))
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.aswPowerModifier)

    const typeConstant = this.getAswType() === "DepthCharge" ? 13 : 8

    const additionalFm = this.getAdditionalFm()

    return Asw.calcPower({
      nakedAsw: ship.nakedStats.asw,
      equipmentAsw,
      improvementModifier,
      typeConstant,

      health: ship.health.aswPowerModifire,
      formation: this.getFormationModifiers().power,
      engagement: this.engagement.modifier,
      synergy: this.getSynergy(),
      additionalFm
    })
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
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
