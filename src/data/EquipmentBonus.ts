import { mapValues } from "lodash-es"
import { GearId, ShipClassId, ShipId } from "@jervis/data"

import { ShipQuery, IShip } from "../objects/ship/ship"
import { GearQuery } from "../objects/gear/Gear"
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

export type StatBonusRule = StatBonusRuleBase & {
  byShip?: ShipQuery
  minStar?: number
  countCap?: number
}

type EquipmentSynergyRule = {
  byGear: GearQuery
  rules?: StatBonusRule[]
} & StatBonusRule

export type EquipmentBonusRule = {
  byGear: GearQuery
  effectiveLosBonus?: boolean
  rules?: StatBonusRule[]
  synergies?: EquipmentSynergyRule[]
} & StatBonusRule

export const equipmentBonusRules: EquipmentBonusRule[] = [
  {
    byGear: GearId["Laté 298B"],
    effectiveLosBonus: true,
    rules: [
      {
        byShip: ShipId["Richelieu改"],
        multiple: { los: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.CommandantTesteClass },
        multiple: { los: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.MizuhoClass, ShipClassId.KamoiClass] } },
        multiple: { los: 2 }
      }
    ]
  },

  // 艦上偵察機
  {
    byGear: {
      categoryId: {
        $in: [GearCategoryId.CarrierBasedReconnaissanceAircraft, GearCategoryId.CarrierBasedReconnaissanceAircraft2]
      }
    },
    effectiveLosBonus: true,
    rules: [
      { minStar: 2, count1: { los: 1 } },
      { minStar: 6, count1: { los: 1 } },
      { minStar: 10, count1: { los: 1 } }
    ]
  },

  {
    byGear: GearId["二式艦上偵察機"],
    effectiveLosBonus: true,
    rules: [
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        minStar: 1,
        count1: { firepower: 3, los: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        minStar: 8,
        count1: { firepower: 1, los: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.HiryuuClass },
        minStar: 1,
        count1: { firepower: 2, los: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["瑞鳳改二乙"], ShipId["鈴谷航改二"], ShipId["熊野航改二"]] } },
        minStar: 1,
        count1: { firepower: 1, los: 1 }
      }
    ]
  }
]

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

const statBonusRuleToRecord = (ship: IShip, byGear: GearQuery, count: number) => (rule: StatBonusRule) => {
  const { byShip, minStar, countCap, multiple, count4, count3, count2, count1 } = rule
  let record: StatsBonusRecord = {}
  if (byShip && !ship.match(byShip)) {
    return record
  }
  if (minStar) {
    const starCount = ship.countGear(gear => gear.match(byGear) && gear.star >= minStar)
    count = Math.min(count, starCount)
  }
  if (countCap) {
    count = Math.min(count, countCap)
  }

  if (multiple) {
    record = multiplyBonus(multiple, count)
  }

  ;[count1, count2, count3, count4].forEach((countBonus, index) => {
    if (countBonus && count > index) {
      record = addBonus(record, countBonus)
    }
  })

  return record
}

export const equipmentBonusRuleToRecord = (ship: IShip) => {
  const toRecord = (rule: EquipmentBonusRule): StatsBonusRecord => {
    const { byGear, byShip, countCap, rules, synergies, effectiveLosBonus } = rule

    if (byShip && !ship.match(byShip)) {
      return {}
    }

    let count = ship.countGear(gear => gear.match(byGear))
    if (count === 0) {
      return {}
    }
    if (countCap) {
      count = Math.min(countCap, count)
    }

    const toRecordWithCount = statBonusRuleToRecord(ship, byGear, count)
    const parentBonus = toRecordWithCount(rule)
    let bonus = rules ? rules.map(toRecordWithCount).reduce(addBonus, parentBonus) : parentBonus

    if (synergies) {
      const synergyBonus = synergies.map(toRecord).reduce(addBonus, {})
      bonus = addBonus(bonus, synergyBonus)
    }

    if (effectiveLosBonus && bonus.los) {
      bonus = addBonus(bonus, { effectiveLos: bonus.los })
    }

    return bonus
  }

  return toRecord
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

const getEffectiveLosBonus = (ship: IShip): StatsBonusRecord => {
  return equipmentBonusRules
    .map(equipmentBonusRuleToRecord(ship))
    .map(({ effectiveLos }) => ({ effectiveLos }))
    .reduce(addBonus, {})
}

export const getEquipmentBonus = (ship: IShip): StatsBonusRecord => {
  const base = createEquipmentBonus(ship)
  const speedBonus = getSpeedBonus(ship)
  const effectiveLosBonus = getEffectiveLosBonus(ship)

  const record = [effectiveLosBonus, speedBonus].reduce(addBonus, base)
  return record
}
