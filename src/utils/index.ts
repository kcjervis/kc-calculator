import { IShip } from '../objects'
import DefensePower from '../Battle/DefensePower'

export const nonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null

export const merge = <T>(target: T, ...sources: Array<Partial<T>>) => {
  for (const source of sources) {
    for (const key in source) {
      const value = source[key]
      if (nonNullable(value)) {
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
