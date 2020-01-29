import { IShip } from "../objects"

export const isNonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null
export const nonNullable = isNonNullable

export const setProperties = <T, K extends keyof T>(target: T, keys: K[], source: Pick<T, K>) => {
  for (const key of keys) {
    const value = source[key]
    target[key] = value
  }
}

export const merge = <T extends object>(target: T, ...sources: Array<Partial<T> | T>) => {
  for (const source of sources) {
    for (const key in source) {
      const value = source[key]
      if (isNonNullable(value)) {
        target[key] = value as T[typeof key]
      }
    }
  }
  return target
}

export const softcap = (cap: number, value: number) => (value <= cap ? value : cap + Math.sqrt(value - cap))

export const shipNameIsKai = (name: string) => name.endsWith("改")

export const shipNameIsKai2 = (name: string) => /(改二|Верный)(?!丙)/.test(name)

export const calcDeadlyPower = (ship: IShip) => {
  const { currentHp } = ship.health
  const defensePower = ship.getDefensePower()
  return currentHp + defensePower.max
}

export const sample = <T>(array: T[]) => {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
}

export * from "./typeGuards"
