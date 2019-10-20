import { Condition } from "../utils"
import { GearStats } from "../types"
import { IGear, IShip } from "../objects"
import { GearQuery } from "../objects/gear/Gear"
import GearAttribute from "./GearAttribute"
import ShipAttribute from "./ShipAttribute"
import { GearId, ShipClassId, ShipId } from "@jervis/data"
import sift, { SiftQuery } from "sift"

type AttackPowerModifierPosition =
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "a7"
  | "a8"
  | "a9"
  | "a10"
  | "a11"
  | "a12"
  | "a13"
  | "a14"
  | "b1"
  | "b2"
  | "b3"
  | "b4"
  | "b5"
  | "b6"
  | "b7"
  | "b8"
  | "b9"
  | "b10"
  | "b11"
  | "b12"
  | "b13"
  | "b14"

type AttackPowerModifier = Partial<Record<AttackPowerModifierPosition, number>>

type ShipCondition = Condition<IShip> | number | { attr: ShipAttribute }

type EquipmentEffectiveness = {
  byTarget?: ShipCondition
  byShip?: ShipCondition
  byGear: GearQuery
  count1?: AttackPowerModifier
  count2?: AttackPowerModifier
  count3?: AttackPowerModifier
  count4?: AttackPowerModifier
  count5?: AttackPowerModifier
}

const modifiers: EquipmentEffectiveness[] = [
  { byTarget: { attr: "IsolatedIsland" }, byGear: { attrs: "AntiAircraftShell" }, count1: { a13: 1.75 } },
  { byGear: { gearId: GearId["WG42 (Wurfgerät 42)"] }, count1: { a13: 1.6 }, count2: { a13: 2.72 } }
]

const shipStatKeys = ["firepower", "armor", "torpedo", "evasion", "antiAir", "asw", "speed", "los", "range"] as const

type StatBonusRecord = Partial<Record<typeof shipStatKeys[number], number>>

type VisibleEquipmentStatBonus = {
  byShip: ShipCondition
  byGear: GearQuery
  multiple?: StatBonusRecord
  count1?: StatBonusRecord
  count2?: StatBonusRecord
  count3?: StatBonusRecord
  count4?: StatBonusRecord
  count5?: StatBonusRecord
}

const bonuses: VisibleEquipmentStatBonus[] = [
  { byGear: { gearId: GearId["三式弾"] }, byShip: { shipId: ShipId["金剛改二"] }, count1: { firepower: 1, antiAir: 1 } }
]

const selectModifier = (gears: IGear[], modifier: EquipmentEffectiveness) => {
  const { byGear, count1, count2, count3, count4, count5 } = modifier
  const count = gears.filter(gear => gear.match(byGear)).length
  if (count === 0) {
    return undefined
  }
  if (count >= 5 && count5) {
    return count5
  }
  if (count >= 4 && count4) {
    return count4
  }
  if (count >= 3 && count3) {
    return count3
  }
  if (count >= 2 && count2) {
    return count2
  }
  if (count >= 1 && count1) {
    return count1
  }

  return undefined
}
