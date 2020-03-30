import { IGear, IFleet, IShip } from "./objects"
import { sumBy } from "lodash-es"
import { isNonNullable } from "./utils"

const calcGearEffectiveLos = (gear: IGear) => {
  const { los, improvement } = gear

  let multiplier = 0.6
  if (gear.is("CarrierBasedTorpedoBomber")) {
    multiplier = 0.8
  } else if (gear.is("CarrierBasedReconnaissanceAircraft") || gear.is("CarrierBasedReconnaissanceAircraft2")) {
    multiplier = 1
  } else if (gear.is("ReconnaissanceSeaplane")) {
    multiplier = 1.2
  } else if (gear.is("SeaplaneBomber")) {
    multiplier = 1.1
  }

  return multiplier * (los + improvement.effectiveLosModifier)
}

const calcShipEffectiveLos = (ship: IShip, nodeDivaricatedFactor: number, withoutExslot = false) => {
  const { nakedStats, stats, totalEquipmentStats, gears } = ship

  let equipTotal: number
  if (withoutExslot) {
    const mainGears = gears.filter((g, index) => index === gears.length - 1).filter(isNonNullable)
    equipTotal = sumBy(mainGears, calcGearEffectiveLos)
  } else {
    equipTotal = totalEquipmentStats(calcGearEffectiveLos)
  }
  const bonus = stats.getBonus("effectiveLos")

  return Math.sqrt(nakedStats.los + bonus) + equipTotal * nodeDivaricatedFactor - 2
}

const calcFleetEffectiveLos = (
  fleet: IFleet,
  nodeDivaricatedFactor: number,
  hqLevel: number,
  withoutExslot?: boolean
) => {
  return (
    fleet.totalShipStats(ship => calcShipEffectiveLos(ship, nodeDivaricatedFactor, withoutExslot)) -
    Math.ceil(0.4 * hqLevel) +
    12
  )
}

export default {
  calcGearEffectiveLos,
  calcShipEffectiveLos,
  calcFleetEffectiveLos
}
