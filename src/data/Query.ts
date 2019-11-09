import { InternalQuery, SiftQuery } from "sift"
import { GearQuery } from "../objects/gear"
import { GearId, ShipClassId, ShipId, ShipName, GearName } from "@jervis/data"
import { MasterData } from "."
import { StatsBonusRecord, StatBonusRule, EquipmentBonusRule } from "./EquipmentBonus"
import { ShipQuery } from "../objects/ship/ship"
import { isObject } from "lodash-es"
import { isPrimitive } from "utility-types"

const data = new MasterData()

type SupportedType = string | number | number[] | string[]

const isInternalQuery = <T extends SupportedType>(query: SiftQuery<T>): query is InternalQuery<T> => {
  if (typeof query !== "object") {
    return false
  }
  const keys: Array<keyof InternalQuery<T>> = [
    "$eq",
    "$ne",
    "$or",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$mod",
    "$in",
    "$nin",
    "$not",
    "$type",
    "$all",
    "$size",
    "$nor",
    "$and",
    "$regex",
    "$elemMatch",
    "$exists",
    "$where",
    "$options"
  ]
  return keys.some(key => key in query)
}

const internalQueryToText = <T extends SupportedType>(toText: (query: SiftQuery<T>) => string) => (
  query: InternalQuery<T>
) => {
  const strs: string[] = []
  const setText = (value: T, end?: string) => strs.push(toText(value) + end)

  const { $and, $or, $not, $gt, $gte, $lt, $lte, $in } = query
  if ($and) {
    return $and.map(toText).join("and")
  }

  if ($or) {
    return $or.map(toText).join("or")
  }

  if ($not) {
    return "not" + toText($not)
  }

  if ($in !== undefined) {
    strs.push($in.map(toText).toString())
  }

  if ($gt !== undefined) {
    setText($gt, "超過")
  }
  if ($gte !== undefined) {
    setText($gte, "以上")
  }
  if ($lt !== undefined) {
    setText($lt, "未満")
  }
  if ($lte !== undefined) {
    setText($lte, "以下")
  }

  return strs.join("")
}

const queryToText = <T extends SupportedType>(query: SiftQuery<T>, toText?: (value: T) => string): string => {
  if (isInternalQuery(query)) {
    const getText = (query: SiftQuery<T>) => queryToText(query, toText)
    return internalQueryToText(getText)(query)
  }

  if (isPrimitive(query)) {
    return typeof toText === "function" ? toText(query as T) : String(query)
  }

  throw Error(`未定義 ${query}`)
}

const gearQueryToText = (query: GearQuery) => {
  const strs: string[] = []

  if (typeof query === "number") {
    return queryToText(query, data.gearIdToName)
  }

  if ("gearId" in query && query.gearId !== undefined) {
    strs.push(queryToText(query.gearId, data.gearIdToName))
  }

  if ("attrs" in query && query.attrs !== undefined) {
    strs.push(queryToText(query.attrs))
  }

  if ("star" in query && query.star) {
    strs.push("★ " + queryToText(query.star))
  }

  return strs.join("")
}

const shipQueryToText = (query: ShipQuery) => {
  const strs: string[] = []

  if (typeof query === "number") {
    return queryToText(query, data.shipIdToName)
  }

  if ("shipId" in query && query.shipId !== undefined) {
    strs.push(queryToText(query.shipId, data.shipIdToName))
  }

  if ("shipClassId" in query && query.shipClassId) {
    strs.push(queryToText(query.shipClassId, data.shipClassIdToName))
  }

  if ("shipTypeId" in query && query.shipTypeId) {
    strs.push(queryToText(query.shipTypeId, data.shipTypeIdToName))
  }

  if ("attrs" in query && query.attrs !== undefined) {
    strs.push(queryToText(query.attrs))
  }

  return strs.join("")
}

const statBonusRecordToText = (record: StatsBonusRecord) => {
  const text = Object.entries(record).map(([key, value]) => `${key}: ${value}`)
  return `{${text}}`
}

const bonusRuleToText = (rule: StatBonusRule) => {
  const { byShip, multiple, count1, count2, count3, count4 } = rule
  let bonusText = multiple ? `累積: ${statBonusRecordToText(multiple)}` : ""
  bonusText += count1 ? `count1: ${statBonusRecordToText(count1)}` : ""
  return [byShip && shipQueryToText(byShip), bonusText]
}

const ruleToText = (rule: EquipmentBonusRule) => {
  const { byGear, rules, synergies } = rule
  const gearCond = gearQueryToText(byGear)
  const bonusRule = bonusRuleToText(rule)
  const rulesCond = rules ? rules.map(bonusRuleToText) : ""
  return [gearCond, bonusRule, rulesCond]
}
