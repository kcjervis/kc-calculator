import { IGear, IFleet, IShip } from "./objects"

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

const calcShipEffectiveLos = (ship: IShip, nodeDivaricatedFactor: number) => {
  const { totalEquipmentStats, nakedStats, stats } = ship
  const equipTotal = totalEquipmentStats(calcGearEffectiveLos)
  const bonus = stats.getBonus("effectiveLos")

  return Math.sqrt(nakedStats.los + bonus) + equipTotal * nodeDivaricatedFactor - 2
}

const calcFleetEffectiveLos = (fleet: IFleet, nodeDivaricatedFactor: number, hqLevel: number) => {
  return fleet.totalShipStats(ship => calcShipEffectiveLos(ship, nodeDivaricatedFactor)) - Math.ceil(0.4 * hqLevel) + 12
}

export default {
  calcGearEffectiveLos,
  calcShipEffectiveLos,
  calcFleetEffectiveLos
}
