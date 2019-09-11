import { GearState } from "../types"
import { ShipStatObject, ShipStatTag } from "./ShipStat"

type EquipmentState = {
  slots: number[]
  gears: Array<GearState | null>
}

type ShipState = {
  masterId: number
  level: number
  hp: number
  morale: number

  equipment: EquipmentState

  modernization: {}
}

type ShipStats = Record<"firepower", ShipStatObject>

class Ship {
  constructor(public stats: ShipStats) {}
}
