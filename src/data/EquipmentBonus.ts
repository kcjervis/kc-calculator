import { mapValues } from "lodash-es"
import { GearId, ShipClassId, ShipId } from "@jervis/data"
import { createEquipmentBonuses, ShipData, GearData } from "equipment-bonus"

import { IShip } from "../objects/ship/ship"
import { IGear } from "../objects/gear/Gear"
import { Speed } from "../common"

import { isNonNullable } from "../utils"

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

const getType2 = (id: number) => {
  if (id === 38) return 3
  if (id === 93) return 13
  if (id === 94) return 9
  return id
}

const toGearData = (gear: IGear): GearData => {
  const types = [0, 0, getType2(gear.categoryId), gear.iconId, 0]
  return {
    accuracy: gear.accuracy,
    antiAir: gear.antiAir,
    armor: gear.armor,
    asw: gear.asw,
    bombing: gear.bombing,
    evasion: gear.evasion,
    firepower: gear.firepower,
    gearId: gear.gearId,
    los: gear.los,
    name: gear.name,
    radius: gear.radius,
    range: gear.range,
    torpedo: gear.torpedo,
    ace: gear.proficiency.level,
    stars: gear.improvement.value,
    types,
    specialType2: gear.categoryId
  }
}

const getEquipmentBonuses = (ship: IShip, gears: IShip["gears"]) => {
  const shipData: ShipData = {
    shipId: ship.shipId,
    stype: ship.shipTypeId,
    ctype: ship.shipClassId,
    yomi: ship.ruby
  }

  const gearDataList = gears.filter(isNonNullable).map(toGearData)

  return createEquipmentBonuses(shipData, gearDataList)
}

export const getEffectiveLosBonus = (ship: IShip) => {
  const gears = ship.gears.filter(gear => gear && isEffectiveLosBonusGear(gear))
  return getEquipmentBonuses(ship, gears).los
}

export const getEquipmentBonus = (ship: IShip): StatsBonusRecord => {
  const base = getEquipmentBonuses(ship, ship.gears)
  const speedBonus = getSpeedBonus(ship)
  const effectiveLosBonus = { effectiveLos: getEffectiveLosBonus(ship) }

  const record = [effectiveLosBonus, speedBonus].reduce(addBonus, base)
  return record
}
