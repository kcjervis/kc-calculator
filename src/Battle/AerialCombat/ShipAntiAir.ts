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

const calcInternalAdjustedAA = (ship: IShip, side: Side) => {
  const { stats, nakedStats, totalEquipmentStats } = ship

  const totalEquipAdjustedAA = totalEquipmentStats(calcGearAdjustedAntiAir)

  if (side === "Enemy") {
    return Math.floor(Math.sqrt(stats.antiAir)) + 0.5 * totalEquipAdjustedAA
  }

  const preFloor = 0.5 * (nakedStats.antiAir + totalEquipAdjustedAA)

  return ship.countGear() === 0 ? preFloor : Math.floor(preFloor)
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

  private get internalAdjustedAA() {
    const { ship, side } = this
    return calcInternalAdjustedAA(ship, side)
  }

  private calcAdjustedAntiAir = (adjustedAntiAirResistance = 1) => {
    const internal = this.internalAdjustedAA

    if (adjustedAntiAirResistance < 1) {
      return 2 * Math.floor(internal * adjustedAntiAirResistance)
    }

    return 2 * internal
  }

  get adjustedAntiAir() {
    return this.calcAdjustedAntiAir()
  }

  public calcProportionalShotdownRate = (adjustedAntiAirResistance = 1) => {
    const { combinedFleetModifier } = this

    const adjustedAntiAir = this.calcAdjustedAntiAir(adjustedAntiAirResistance)

    return Math.floor(adjustedAntiAir) * combinedFleetModifier * 0.5 * 0.25 * 0.02
  }

  public calcFixedShotdownNumber = (adjustedAntiAirResistance = 1, fleetAntiAirResistance = 1) => {
    const { fleetAntiAir, side, antiAirCutin, combinedFleetModifier } = this

    const adjustedAntiAir = this.calcAdjustedAntiAir(adjustedAntiAirResistance)

    const base = 0.5 * (Math.floor(adjustedAntiAir) + Math.floor(fleetAntiAir * fleetAntiAirResistance))

    // 敵味方補正
    const sideModifier = side === "Player" ? 0.8 : 0.75

    let preFloor = base * 0.25 * sideModifier * combinedFleetModifier

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
