import { IShip } from '../Ship'
import { IBaseStats, shipStatKeys } from '../ShipNakedStats'

type BonusPojo = Partial<IBaseStats> & { multiplier?: number }

export type StatsBonusCreator = (ship: IShip) => StatsBonus | undefined

export default class StatsBonus implements IBaseStats {
  public hp = 0
  public firepower = 0
  public torpedo = 0
  public antiAir = 0
  public armor = 0
  public asw = 0
  public los = 0
  public evasion = 0
  public speed = 0
  public range = 0
  public luck = 0
  constructor(pojo?: BonusPojo) {
    if (pojo) {
      this.add(pojo)
    }
  }

  public add(pojo: BonusPojo) {
    const { multiplier = 1 } = pojo
    for (const key of shipStatKeys) {
      const value = pojo[key]
      if (typeof value === 'number') {
        this[key] += value * multiplier
      }
    }

    return this
  }
}
