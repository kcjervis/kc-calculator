import { IEquipment, IFleet, IShip } from './objects'

const equipmentEffectiveLos = (equipment: IEquipment) => {
  const { category, los, improvement } = equipment

  let multiplier = 0.6
  if (category.is('CarrierBasedTorpedoBomber')) {
    multiplier = 0.8
  } else if (category.either('CarrierBasedReconnaissanceAircraft', 'CarrierBasedReconnaissanceAircraft2')) {
    multiplier = 1
  } else if (category.is('ReconnaissanceSeaplane')) {
    multiplier = 1.2
  } else if (category.is('SeaplaneBomber')) {
    multiplier = 1.1
  }

  return multiplier * (los + improvement.effectiveLosModifier)
}

const shipEffectiveLos = (ship: IShip, nodeDivaricatedFactor: number) => {
  const { totalEquipmentStats, nakedStats } = ship
  const equipTotal = totalEquipmentStats(equipmentEffectiveLos)
  return Math.sqrt(nakedStats.los) + equipTotal * nodeDivaricatedFactor - 2
}

const fleetEffectiveLos = (fleet: IFleet, nodeDivaricatedFactor: number, hqLevel: number) => {
  return fleet.totalShipStats(ship => shipEffectiveLos(ship, nodeDivaricatedFactor)) - Math.ceil(0.4 * hqLevel) + 12
}

export default class EffectiveLos {
  public static equipmentEffectiveLos = equipmentEffectiveLos
  public static shipEffectiveLos = shipEffectiveLos
  public static fleetEffectiveLos = fleetEffectiveLos
}
