import { IShip } from "../objects"
import DefensePower from "../Battle/DefensePower"

export const isNonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null
export const nonNullable = isNonNullable

export const setProperties = <T, K extends keyof T>(target: T, keys: K[], source: Pick<T, K>) => {
  for (const key of keys) {
    const value = source[key]
    target[key] = value
  }
}

export const merge = <T>(target: T, ...sources: Array<Partial<T>>) => {
  for (const source of sources) {
    for (const key in source) {
      const value = source[key]
      if (isNonNullable(value)) {
        target[key] = value
      }
    }
  }
  return target
}

export const softcap = (cap: number, value: number) => (value <= cap ? value : cap + Math.sqrt(value - cap))

export const shipNameIsKai = (name: string) => name.endsWith("改")

export const shipNameIsKai2 = (name: string) => /(改二|Верный)(?!丙)/.test(name)

export const calcDeadlyPower = (ship: IShip) => {
  const { nowHp } = ship.health
  const { armor } = ship.stats
  const defensePower = new DefensePower(armor, ship.totalEquipmentStats(gear => gear.improvement.defensePowerModifier))
  return nowHp + defensePower.max
}

export * from "./isMatch"
