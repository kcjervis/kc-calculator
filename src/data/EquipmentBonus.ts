import { mapValues } from "lodash-es"
import { GearId, ShipClassId, ShipId } from "@jervis/data"

import { ShipQuery, IShip } from "../objects/ship/ship"
import { GearQuery, IGear } from "../objects/gear/Gear"
import { Speed } from "../common"

import { GearCategoryId } from "./GearCategory"
import { createEquipmentBonus } from "./EquipmentBonusData"

export const shipStatKeys = [
  "firepower",
  "armor",
  "torpedo",
  "accuracy",
  "evasion",
  "antiAir",
  "asw",
  "speed",
  "los",
  "range",
  "speed",
  "effectiveLos"
] as const
export type StatsBonusRecord = Partial<Record<typeof shipStatKeys[number], number>>

export type StatBonusRuleBase = {
  multiple?: StatsBonusRecord
  count1?: StatsBonusRecord
  count2?: StatsBonusRecord
  count3?: StatsBonusRecord
  count4?: StatsBonusRecord
}

export const multiplyBonus = (bonus: StatsBonusRecord, multiplier: number) =>
  mapValues(bonus, stat => stat && stat * multiplier)

export const addBonus = (bonus: StatsBonusRecord, other: StatsBonusRecord) => {
  const result: StatsBonusRecord = {}
  for (const key of shipStatKeys) {
    const stat = (bonus[key] || 0) + (other[key] || 0)
    if (stat !== 0) result[key] = stat
  }
  return result
}

const getSpeedBonus = (ship: IShip) => {
  if (!ship.hasGear(GearId["改良型艦本式タービン"])) {
    return {}
  }

  const speedGroup = Speed.getSpeedGroup(ship)
  const enhancedBoilerCount = ship.countGear(GearId["強化型艦本式缶"])
  const newModelBoilerCount = ship.countGear(GearId["新型高温高圧缶"])
  const speedIncrement = Speed.getSpeedIncrement(speedGroup, enhancedBoilerCount, newModelBoilerCount)

  if (speedIncrement > 0) {
    return { speed: speedIncrement }
  }

  if (ship.shipClassId === ShipClassId.JohnCButlerClass || ship.shipId === ShipId["夕張改二特"]) {
    return { speed: 5 }
  }

  return {}
}

const isEffectiveLosBonusGear = (gear: IGear) => {
  return !gear.is("SmallRadar")
}

export const getEffectiveLosBonus = (ship: IShip) => {
  const gears = ship.gears.filter(gear => gear && isEffectiveLosBonusGear(gear))
  const { shipId, ruby, shipTypeId, shipClassId } = ship
  return createEquipmentBonus({ shipId, ruby, shipTypeId, shipClassId, gears }).los
}

export const getEquipmentBonus = (ship: IShip): StatsBonusRecord => {
  const base = createEquipmentBonus(ship)
  const speedBonus = getSpeedBonus(ship)
  const effectiveLosBonus = { effectiveLos: getEffectiveLosBonus(ship) }

  const record = [effectiveLosBonus, speedBonus].reduce(addBonus, base)
  return record
}
