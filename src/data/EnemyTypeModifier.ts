import { Condition, isMatch } from "../utils"
import { GearStats } from "../types"
import GearAttribute from "./GearAttribute"
import { GearId } from "@jervis/data"
import { IGear, IShip } from "../objects"
import { ShipAttribute } from "."

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

type GearCondition = Condition<GearStats> | { attr: GearAttribute | GearAttribute[] }

type ShipCondition = Condition<IShip> | number | { attr: ShipAttribute }

type EquipmentEffect = {}

type EquipmentEffectiveness = {
  byTarget?: ShipCondition
  byShip?: ShipCondition
  byGear: GearCondition
  count1?: AttackPowerModifier
  count2?: AttackPowerModifier
  count3?: AttackPowerModifier
  count4?: AttackPowerModifier
  count5?: AttackPowerModifier
}

const modifiers: EquipmentEffectiveness[] = [
  { byTarget: { attr: "IsolatedIsland" }, byGear: { attr: "AntiAircraftShell" }, count1: { a13: 1.75 } },
  { byGear: { gearId: GearId["WG42 (Wurfgerät 42)"] }, count1: { a13: 1.6 }, count2: { a13: 2.72 } }
]

const shipStatKeys = ["firepower", "armor", "torpedo", "evasion", "antiAir", "asw", "speed", "los", "range"] as const

type StatBonusRecord = Partial<Record<typeof shipStatKeys[number], number>>

type VisibleEquipmentStatBonus = {
  byShip: ShipCondition
  byGear: GearCondition
  multiple?: StatBonusRecord
  count1?: StatBonusRecord
  count2?: StatBonusRecord
  count3?: StatBonusRecord
  count4?: StatBonusRecord
  count5?: StatBonusRecord
}

const matchesGear = (condition: GearCondition) => (gear: IGear) => {
  if (!("attr" in condition)) {
    return isMatch(gear, condition)
  }
  const { attr } = condition
  if (typeof attr === "string") {
    return gear.is(attr)
  }
  return attr.some(gear.is)
}

const selectModifier = (gears: IGear[], modifier: EquipmentEffectiveness) => {
  const { byGear, count1, count2, count3, count4, count5 } = modifier
  const count = gears.filter(matchesGear(byGear)).length
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
