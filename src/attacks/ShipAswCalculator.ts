import { IShip } from "../objects"
import { Asw } from "../formulas"
import { AttackPowerModifierRecord, FunctionalModifier, createCriticalFm } from "../common"

export type AswTime = "Opening" | "Day" | "Night"

type AswType = "DepthCharge" | "AircraftCarrier" | "None"

/**
 * @see https://twitter.com/KennethWWKK/status/1156195106837286912
 */
const getSynergyModifier = (ship: IShip) => {
  const { hasGear } = ship
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

const getArmorPenetration = (ship: IShip) => {
  const shipTypeAddtive = ship.shipType.is("CoastalDefenseShip") ? 1 : 0
  return ship.totalEquipmentStats(gear => {
    if (!gear.is("AdditionalDepthCharge")) {
      return 0
    }
    return Math.sqrt(gear.asw - 2) + shipTypeAddtive
  })
}

const canDoDepthChargeAsw = (ship: IShip) => {
  if (ship.nakedStats.asw === 0) {
    return false
  }

  if (ship.shipClass.any("FusouClass", "IseClass", "R1")) {
    return false
  }

  return true
}

const canDoAircraftAsw = (ship: IShip) => {
  if (
    ship.shipType.any(
      "AviationCruiser",
      "AviationBattleship",
      "SeaplaneTender",
      "LightAircraftCarrier",
      "AmphibiousAssaultShip"
    ) ||
    ship.shipClass.is("RevisedKazahayaClass")
  ) {
    return ship.planes.some(plane => plane.slotSize > 0 && plane.is("AswAircraft"))
  }

  return false
}

export const getAswType = (ship: IShip, isNight = false): AswType => {
  if (!isNight && canDoAircraftAsw(ship)) {
    return "AircraftCarrier"
  }

  if (canDoDepthChargeAsw(ship)) {
    return "DepthCharge"
  }

  return "None"
}

type AswPowerShipFactors = {
  nakedAsw: number
  equipmentAsw: number
  improvementModifier: number
  typeConstant: number
  healthModifier: number
  synergyModifier: number

  proficiencyModifier: number
}

type AswAccuracyShipFactors = {
  shipAccuracy: number
  aswEquipmentModifier: number
  improvementModifier: number
  moraleModifier: number
}

type AswShipState = {
  power: AswPowerShipFactors
  accuracy: AswAccuracyShipFactors
  armorPenetration: number
  type: AswType
}

const toAswShipState = (ship: IShip, time: AswTime): AswShipState => {
  const { shipAccuracy } = ship
  const type = getAswType(ship, time === "Night")

  const aswEquipmentModifier = ship.totalEquipmentStats(gear => {
    if (gear.is("Sonar")) {
      return 2 * gear.asw
    }
    if (gear.is("AdditionalDepthCharge")) {
      return gear.asw
    }
    return 0
  })

  let proficiencyModifier = 1
  if (type === "AircraftCarrier" && time !== "Opening" && !ship.shipClass.is("RevisedKazahayaClass")) {
    proficiencyModifier = ship.getNormalProficiencyModifiers().power
  }

  return {
    power: {
      nakedAsw: ship.nakedStats.asw,
      equipmentAsw: ship.totalEquipmentStats(gear => (gear.is("AswGear") ? gear.asw : 0)),
      improvementModifier: ship.totalEquipmentStats(gear => gear.improvement.aswPowerModifier),
      typeConstant: type === "DepthCharge" ? 13 : 8,
      healthModifier: ship.health.aswPowerModifier,
      synergyModifier: getSynergyModifier(ship),

      proficiencyModifier
    },
    accuracy: {
      shipAccuracy,
      aswEquipmentModifier,
      improvementModifier: ship.totalEquipmentStats(gear => gear.improvement.aswAccuracyModifier),
      moraleModifier: ship.morale.getAccuracyModifier("asw")
    },
    armorPenetration: getArmorPenetration(ship),
    type
  }
}

export default class ShipAswCalculator {
  public static fromShip = (ship: IShip, time: AswTime) => {
    const state = toAswShipState(ship, time)
    return new ShipAswCalculator(state)
  }

  constructor(private state: AswShipState) {}

  get armorPenetration() {
    return this.state.armorPenetration
  }

  get type() {
    return this.state.type
  }

  public calcBasicPower = (additive = 0) => {
    const { nakedAsw, equipmentAsw, improvementModifier, typeConstant } = this.state.power
    return Math.sqrt(nakedAsw) * 2 + equipmentAsw * 1.5 + improvementModifier + typeConstant
  }

  public calcPower = (params: {
    formationModifier: number
    engagementModifier: number
    isCritical: boolean
    optionalModifiers?: AttackPowerModifierRecord
  }) => {
    const { proficiencyModifier } = this.state.power

    let fm11next: FunctionalModifier | undefined
    if (params.isCritical) {
      fm11next = createCriticalFm(proficiencyModifier)
    }

    return Asw.createPower({ ...this.state.power, ...params, fm11next })
  }

  public calcAccuracy = (params: { formationModifier: number }) => {
    return Asw.calcAccuracy({ ...this.state.accuracy, ...params })
  }
}
