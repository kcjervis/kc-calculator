import { sumBy } from "lodash-es"
import { IGear, IFleet, IShip } from "./objects"
import carrierBasedReconnaissanceAircraftBonus from "./objects/Ship/ExplicitStatsBonus/艦上偵察機"

const gearEffectiveLos = (gear: IGear) => {
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

const shipEffectiveLos = (ship: IShip, nodeDivaricatedFactor: number) => {
  const { totalEquipmentStats, nakedStats } = ship
  const equipTotal = totalEquipmentStats(gearEffectiveLos)

  const fitBonus = sumBy(carrierBasedReconnaissanceAircraftBonus, createBonus => {
    const bonus = createBonus(ship)
    return bonus ? bonus.los : 0
  })

  return Math.sqrt(nakedStats.los + fitBonus) + equipTotal * nodeDivaricatedFactor - 2
}

const fleetEffectiveLos = (fleet: IFleet, nodeDivaricatedFactor: number, hqLevel: number) => {
  return fleet.totalShipStats(ship => shipEffectiveLos(ship, nodeDivaricatedFactor)) - Math.ceil(0.4 * hqLevel) + 12
}

export default {
  gearEffectiveLos,
  shipEffectiveLos,
  fleetEffectiveLos
}
