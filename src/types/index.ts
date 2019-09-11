import { PickByValue } from "utility-types"

export type KeysByValue<T, ValueType> = {
  [Key in keyof T]: T[Key] extends ValueType ? Key : never
}[keyof T]

export * from "./gear"
export * from "./battle"
export * from "./warfare"
