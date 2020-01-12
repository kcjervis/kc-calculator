import { createAttackPower } from "../common"
import { AttackPowerModifierRecord, composeAttackPowerModifierRecord } from "../common"
import { IShip } from "../objects"

type TorpedoAttackPowerShipFactors = {
  torpedo: number
  improvementModifier: number
  healthModifier: number
}

type TorpedoAttackPowerExternalFactors = {
  fleetFactor: number
  formationModifier: number
  engagementModifier: number
  isCritical: boolean
  optionalModifiers?: AttackPowerModifierRecord
}

type TorpedoAttackPowerFactors = TorpedoAttackPowerShipFactors & TorpedoAttackPowerExternalFactors

type TorpedoAttackAccuracyShipFactors = {
  shipAccuracy: number
  equipmentAccuracy: number
  improvementModifier: number
  moraleModifier: number
}

type TorpedoAttackAccuracyExternalFactors = {
  formationModifier: number
  powerModifier: number
  innateTorpedoAccuracy: number
}

type TorpedoAttackAccuracyFactors = TorpedoAttackAccuracyShipFactors & TorpedoAttackAccuracyExternalFactors

type TorpedoAttackShipState = {
  power: TorpedoAttackPowerShipFactors
  accuracy: TorpedoAttackAccuracyShipFactors
}

const calcPower = (factors: TorpedoAttackPowerFactors) => {
  const {
    torpedo,
    improvementModifier,
    healthModifier,
    fleetFactor,
    formationModifier,
    engagementModifier,
    isCritical,
    optionalModifiers
  } = factors

  const a14 = formationModifier * engagementModifier * healthModifier
  const modifiers = composeAttackPowerModifierRecord({ a14 }, optionalModifiers)

  const basic = torpedo + improvementModifier + fleetFactor
  const cap = 150
  const preCriticalPower = createAttackPower({ basic, cap, modifiers })
  const preCritical = preCriticalPower.postcap

  if (!isCritical) {
    return { ...preCriticalPower, preCritical }
  }

  const postcap = Math.floor(preCriticalPower.postcap * 1.5)
  return { ...preCriticalPower, preCritical, postcap }
}

const calcAccuracy = (factors: TorpedoAttackAccuracyFactors) => {
  const {
    shipAccuracy,
    equipmentAccuracy,
    improvementModifier,
    powerModifier,
    innateTorpedoAccuracy,
    formationModifier,
    moraleModifier
  } = factors

  const constant = 85
  const preFormationModifier =
    constant + shipAccuracy + equipmentAccuracy + improvementModifier + powerModifier + innateTorpedoAccuracy

  return Math.floor(preFormationModifier * formationModifier * moraleModifier)
}

export default class ShipTorpedoAttackCalculator {
  public static fromShip = (ship: IShip) => {
    const { shipAccuracy } = ship

    const state: TorpedoAttackShipState = {
      power: {
        torpedo: ship.stats.torpedo,
        improvementModifier: ship.totalEquipmentStats(gear => gear.improvement.torpedoPowerModifier),
        healthModifier: ship.health.torpedoPowerModifier
      },
      accuracy: {
        shipAccuracy,
        equipmentAccuracy: ship.totalEquipmentStats("accuracy"),
        improvementModifier: ship.totalEquipmentStats(gear => gear.improvement.torpedoAccuracyModifier),
        moraleModifier: ship.morale.getAccuracyModifier("torpedo")
      }
    }

    return new ShipTorpedoAttackCalculator(state)
  }
  constructor(private state: TorpedoAttackShipState) {}

  public calcPower = (params: TorpedoAttackPowerExternalFactors) => {
    return calcPower({ ...this.state.power, ...params })
  }

  public calcAccuracy = (params: TorpedoAttackAccuracyExternalFactors) => {
    return calcAccuracy({ ...this.state.accuracy, ...params })
  }
}
