import { ShipId } from "@jervis/data"
import { ShipInformation } from "../types"
import { IShip, IGear } from "../objects"
import { Asw, FunctionalModifier, createCriticalFm, createHitRate, AswPowerFactors } from "../formulas"
import { Engagement, Formation } from "../constants"
import { Damage } from "../Battle"

export const isAswAircraft = ({ asw, category }: IGear) =>
  asw > 0 &&
  category.any(
    "CarrierBasedDiveBomber",
    "CarrierBasedTorpedoBomber",
    "SeaplaneBomber",
    "Autogyro",
    "AntiSubmarinePatrolAircraft",
    "LargeFlyingBoat"
  )

export const isAswGear = (gear: IGear) =>
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

export default class AswAttackStatus {
  constructor(private ship: IShip, private isNight: boolean) {}

  get type() {
    return getAswType(this.ship, this.isNight)
  }

  get typeConstant() {
    return this.type === "DepthCharge" ? 13 : 8
  }

  /**
   * @see https://twitter.com/KennethWWKK/status/1156195106837286912
   */
  get synergyModifier() {
    const { hasGear } = this.ship
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

  get armorPenetration() {
    const { ship } = this
    const shipTypeAddtive = ship.shipType.is("CoastalDefenseShip") ? 1 : 0
    return ship.totalEquipmentStats(gear => {
      if (!gear.is("AdditionalDepthCharge")) {
        return 0
      }
      return Math.sqrt(gear.asw - 2) + shipTypeAddtive
    })
  }

  get equipmentAsw() {
    return this.ship.totalEquipmentStats(gear => (isAswGear(gear) ? gear.asw : 0))
  }

  get improvementModifier() {
    return this.ship.totalEquipmentStats(gear => gear.improvement.aswPowerModifier)
  }

  private getAdditionalFm = (isCritical = false, isOpeningAaw = false) => {
    const { type } = this
    if (!isCritical) {
      return undefined
    }

    if (isOpeningAaw || type !== "AircraftCarrier") {
      return createCriticalFm()
    }
    const { power } = this.ship.getNormalProficiencyModifiers()
    return createCriticalFm(power)
  }

  public createPower = (params: {
    formationModifier: number
    engagementModifier: number
    isCritical: boolean
    isOpeningAaw: boolean
  }) => {
    const { ship, typeConstant, equipmentAsw, improvementModifier, synergyModifier } = this
    const additionalFm = this.getAdditionalFm(params.isCritical, params.isOpeningAaw)

    return Asw.createPower({
      nakedAsw: ship.nakedStats.asw,
      equipmentAsw,
      improvementModifier,
      typeConstant,

      healthModifier: ship.health.aswPowerModifire,
      synergyModifier,
      additionalFm,
      ...params
    })
  }
}
