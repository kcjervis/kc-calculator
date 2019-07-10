import { IEquipment, IShip } from '../../objects'
import { Side } from '../../constants'
import AntiAirCutin from './AntiAirCutin'
import { ShipType } from '../../data'

export const calcEquipmentAdjustedAntiAir = (equipment: IEquipment) => {
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

export const calcShipAdjustedAntiAir = (ship: IShip, side: Side) => {
  const { stats, nakedStats, totalEquipmentStats } = ship

  const totalEquipAdjustedAA = totalEquipmentStats(calcEquipmentAdjustedAntiAir)
  if (side === Side.Enemy) {
    return Math.floor(Math.floor(Math.sqrt(stats.antiAir)) * 2 + totalEquipAdjustedAA)
  }

  const preFloor = nakedStats.antiAir + totalEquipAdjustedAA
  if (ship.countEquipment() === 0) {
    return preFloor
  }
  return 2 * Math.floor(preFloor / 2)
}

const isPropellantBarrageShipType = (type: ShipType) =>
  type.isAircraftCarrierClass || type.either('AviationCruiser', 'AviationBattleship', 'SeaplaneTender')

export default class ShipAntiAir {
  constructor(
    private ship: IShip,
    private side: Side,
    private fleetAntiAir: number,
    private combinedFleetModifier = 1,
    private antiAirCutin?: AntiAirCutin
  ) {}

  get adjustedAntiAir() {
    const { ship, side } = this
    return calcShipAdjustedAntiAir(ship, side)
  }

  get proportionalShotdownRate() {
    const { adjustedAntiAir, combinedFleetModifier } = this
    return adjustedAntiAir * combinedFleetModifier * 0.5 * 0.25 * 0.02
  }

  get fixedShotdownNumber() {
    const { adjustedAntiAir, fleetAntiAir, side, antiAirCutin, combinedFleetModifier } = this
    // 敵味方補正
    const campMod = side === Side.Player ? 0.8 : 0.75
    let preFloor = (adjustedAntiAir + fleetAntiAir) * 0.5 * 0.25 * campMod * combinedFleetModifier
    if (antiAirCutin) {
      preFloor *= antiAirCutin.fixedAirDefenseModifier
    }
    return Math.floor(preFloor)
  }

  get minimumBonus() {
    const { side, antiAirCutin } = this
    if (antiAirCutin) {
      return antiAirCutin.minimumBonus
    }
    return side === Side.Player ? 1 : 0
  }

  get antiAirPropellantBarrageChance() {
    const { ship, adjustedAntiAir } = this
    const { shipType } = ship
    if (!isPropellantBarrageShipType(shipType)) {
      return 0
    }
    const count = ship.countEquipment(274)
    if (!count) {
      return 0
    }
    const shipClassBonus = ship.shipClass.is('IseClass') ? 0.25 : 0
    return (adjustedAntiAir + 0.9 * ship.stats.luck) / 281 + (count - 1) * 0.15 + shipClassBonus
  }
}
