import { isMatchWith, isObject, isEqual } from "lodash-es"

export const isNonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null

export type LogicalCondition<T> =
  | {
      $or: Array<Condition<T>>
    }
  | {
      $and: Array<Condition<T>>
    }
  | { $not: Condition<T> }

export type NumberCondition<T extends number = number> =
  | T
  | T[]
  | {
      $lt?: number
      $lte?: number
      $gt?: number
      $gte?: number
      $between?: [number, number]
    }
export type StringCondition<T extends string = string> = T | T[]
export type ObjectCondition<T extends object> = object &
  {
    [K in keyof T]?: Condition<T[K]>
  }

export type Condition<T> =
  | T
  | T[]
  | (T extends object
      ? ObjectCondition<T>
      : T extends number
      ? NumberCondition<T>
      : T extends string
      ? StringCondition<T>
      : T)
  | LogicalCondition<T>

export const matchString = <T extends string>(value: T, condition: StringCondition<T>) => {
  if (Array.isArray(condition)) {
    return condition.includes(value)
  }
  return value === condition
}

export const matchNumber = <T extends number>(value: T, condition: NumberCondition<T>) => {
  if (Array.isArray(condition)) {
    return condition.includes(value)
  }
  if (typeof condition === "number") {
    return value === condition
  }

  const { $lt, $lte, $gt, $gte, $between } = condition

  return [
    typeof $lt === "number" && value < $lt,
    typeof $lte === "number" && value <= $lte,
    typeof $gt === "number" && value > $gt,
    typeof $gte === "number" && value >= $gte,
    Array.isArray($between) && value >= $between[0] && value <= $between[1]
  ].includes(true)
}

export const isMatch = <T>(value: T, condition: Condition<T>): boolean => {
  if (isObject(condition)) {
    if ("$and" in condition) {
      return condition.$and.every(cond => isMatch(value, cond))
    }
    if ("$or" in condition) {
      return condition.$or.some(cond => isMatch(value, cond))
    }
    if ("$not" in condition) {
      return !isMatch(value, condition.$not)
    }
    if (isObject(value)) {
      return isMatchWith(value, condition, isMatch)
    }
  }

  if (Array.isArray(condition)) {
    return condition.includes(value)
  }

  if (typeof value === "number" && (typeof condition === "number" || isObject(condition))) {
    return matchNumber(value, condition as NumberCondition<typeof value>)
  }
  if (typeof value === "string" && typeof condition === "string") {
    return matchString(value, condition as StringCondition<typeof value>)
  }

  return isEqual(value, condition)
}
