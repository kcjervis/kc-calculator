import { BattleType, FleetRole, Side } from '../constants'
import AntiAirCutin from '../data/AntiAirCutin'
import { IEquipment, IFleet, IShip } from '../objects'

export const equipmentAdjustedAntiAir = (equipment: IEquipment) => {
  const { antiAir, category, improvement, isHighAngleMount } = equipment
  if (antiAir === 0) {
    return 0
  }

  let multiplier = 0
  if (category.is('AntiAircraftGun')) {
    multiplier = 6
  } else if (category.is('AntiAircraftFireDirector') || isHighAngleMount) {
    multiplier = 4
  } else if (category.isRadar) {
    multiplier = 3
  }
  return multiplier * antiAir + improvement.adjustedAntiAirModifier
}

export const equipmentFleetAntiAir = (equipment: IEquipment) => {
  const { name, antiAir, category, isHighAngleMount, improvement } = equipment
  if (antiAir === 0) {
    return 0
  }

  let multiplier = 0
  if (category.is('AntiAircraftFireDirector') || isHighAngleMount) {
    multiplier = 0.35
  } else if (category.is('AntiAircraftShell')) {
    multiplier = 0.6
  } else if (category.isRadar) {
    multiplier = 0.4
  } else if (name === '46cm三連装砲') {
    multiplier = 0.25
  } else {
    multiplier = 0.2
  }
  return multiplier * antiAir + improvement.fleetAntiAirModifier
}

export const shipAdjustedAntiAir = (ship: IShip, side: Side) => {
  const { stats, nakedStats, totalEquipmentStats } = ship

  const totalEquipAdjustedAA = totalEquipmentStats(equipmentAdjustedAntiAir)
  if (side === Side.Enemy) {
    return Math.floor(2 * Math.sqrt(stats.antiAir) + totalEquipAdjustedAA)
  }

  const preFloor = nakedStats.antiAir + totalEquipAdjustedAA
  if (ship.countEquipment() === 0) {
    return preFloor
  }
  return 2 * Math.floor(preFloor / 2)
}

export const shipFleetAntiAir = (ship: IShip) => Math.floor(ship.totalEquipmentStats(equipmentFleetAntiAir))

export const fleetAntiAir = (fleet: IFleet, side: Side, formationModifier: number) => {
  const { totalShipStats } = fleet
  const totalShipFleetAntiAir = totalShipStats(shipFleetAntiAir)
  const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2

  if (side === Side.Player) {
    return postFloor / 1.3
  }
  return postFloor
}

export const getCombinedFleetModifier = (battleType: BattleType, fleetRole: FleetRole) => {
  if (fleetRole === FleetRole.EscortFleet) {
    return 0.48
  }
  if (battleType === BattleType.AirDefenseBattle) {
    return 0.72
  }
  return 0.8
}

export const proportionalShotdownRate = (ship: IShip, side: Side, combinedFleetModifier = 1) => {
  const adjustedAntiAir = shipAdjustedAntiAir(ship, side)
  return adjustedAntiAir * combinedFleetModifier * 0.5 * 0.25 * 0.02
}

export const fixedShotdownNumber = (
  ship: IShip,
  side: Side,
  fleetAA: number,
  combinedFleetModifier = 1,
  antiAirCutin?: AntiAirCutin
) => {
  const adjustedAntiAir = shipAdjustedAntiAir(ship, side)

  // 敵味方補正
  const campMod = side === Side.Player ? 0.8 : 0.75
  let preFloor = (adjustedAntiAir + fleetAA) * 0.5 * 0.25 * campMod * combinedFleetModifier
  if (antiAirCutin) {
    preFloor *= antiAirCutin.fixedAirDefenseModifier
  }
  return Math.floor(preFloor)
}
