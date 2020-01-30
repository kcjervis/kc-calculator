import { IGear, IShip } from "../../objects"
import { Side } from "../../types"
import AntiAirCutin from "./AntiAirCutin"
import { ShipType } from "../../data"
import { GearId } from "@jervis/data"

export const calcGearAdjustedAntiAir = (gear: IGear) => {
  const { antiAir, improvement } = gear
  if (antiAir === 0) {
    return 0
  }

  let multiplier = 0
  if (gear.is("AntiAircraftGun")) {
    multiplier = 6
  } else if (gear.is("AntiAircraftFireDirector") || gear.is("HighAngleMount")) {
    multiplier = 4
  } else if (gear.is("Radar")) {
    multiplier = 3
  }
  return multiplier * antiAir + improvement.adjustedAntiAirModifier
}

export const calcShipAdjustedAntiAir = (ship: IShip, side: Side) => {
  const { stats, nakedStats, totalEquipmentStats } = ship

  const totalEquipAdjustedAA = totalEquipmentStats(calcGearAdjustedAntiAir)
  if (side === "Enemy") {
    return Math.floor(Math.floor(Math.sqrt(stats.antiAir)) * 2 + totalEquipAdjustedAA)
  }

  const preFloor = nakedStats.antiAir + totalEquipAdjustedAA
  if (ship.countGear() === 0) {
    return preFloor
  }
  return 2 * Math.floor(preFloor / 2)
}

const isPropellantBarrageShipType = (type: ShipType) =>
  type.isAircraftCarrierClass || type.any("AviationCruiser", "AviationBattleship", "SeaplaneTender")

type PlaneParams = {
  slotSize: number
  adjustedAntiAirResistModifier: number
  fleetAntiAirResistModifier: number
}

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

  public calcProportionalShotdownRate = (adjustedAntiAirResistModifier = 1) => {
    const { adjustedAntiAir, combinedFleetModifier } = this

    return Math.floor(adjustedAntiAir * adjustedAntiAirResistModifier) * combinedFleetModifier * 0.5 * 0.25 * 0.02
  }

  public calcFixedShotdownNumber = (adjustedAntiAirResistModifier = 1, fleetAntiAirResistModifier = 1) => {
    const { adjustedAntiAir, fleetAntiAir, side, antiAirCutin, combinedFleetModifier } = this
    // 敵味方補正
    const sideModifier = side === "Player" ? 0.8 : 0.75

    const base =
      Math.floor(adjustedAntiAir * adjustedAntiAirResistModifier) +
      Math.floor(fleetAntiAir * fleetAntiAirResistModifier)

    let preFloor = base * 0.5 * 0.25 * sideModifier * combinedFleetModifier

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
    return side === "Player" ? 1 : 0
  }

  get antiAirPropellantBarrageChance() {
    const { ship, adjustedAntiAir } = this
    const { shipType } = ship
    if (!isPropellantBarrageShipType(shipType)) {
      return 0
    }
    const count = ship.countGear(GearId["12cm30連装噴進砲改二"])
    if (!count) {
      return 0
    }
    const shipClassBonus = ship.shipClass.is("IseClass") ? 0.25 : 0
    return (adjustedAntiAir + 0.9 * ship.stats.luck) / 281 + (count - 1) * 0.15 + shipClassBonus
  }

  public getShotdownNumber = ({ slotSize, adjustedAntiAirResistModifier, fleetAntiAirResistModifier }: PlaneParams) => {
    let value = 0

    // 割合撃墜
    if (Math.random() > 0.5) {
      const rate = this.calcProportionalShotdownRate(adjustedAntiAirResistModifier)
      value += Math.floor(slotSize * rate)
    }

    // 固定撃墜
    if (Math.random() > 0.5) {
      const fixed = this.calcFixedShotdownNumber(adjustedAntiAirResistModifier, fleetAntiAirResistModifier)
      value += Math.floor(fixed)
    }

    // 最低保証
    value += this.minimumBonus

    return value
  }
}
