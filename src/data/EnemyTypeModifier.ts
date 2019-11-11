import { GearStats } from "../types"
import { IGear, IShip } from "../objects"
import { GearQuery } from "../objects/gear/Gear"
import { GearId, ShipClassId, ShipId } from "@jervis/data"
import { ShipQuery } from "../objects/ship/ship"

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

type EquipmentEffectiveness = {
  byTarget?: ShipQuery
  byShip?: ShipQuery
  byGear: GearQuery
  count1?: AttackPowerModifier
  count2?: AttackPowerModifier
  count3?: AttackPowerModifier
  count4?: AttackPowerModifier
  count5?: AttackPowerModifier
}

const modifiers: EquipmentEffectiveness[] = [
  { byTarget: { attrs: "IsolatedIsland" }, byGear: { attrs: "AntiAircraftShell" }, count1: { a13: 1.75 } },
  { byGear: { gearId: GearId["WG42 (Wurfgerät 42)"] }, count1: { a13: 1.6 }, count2: { a13: 2.72 } }
]
