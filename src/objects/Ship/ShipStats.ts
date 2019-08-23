import { maxBy, sumBy } from "lodash-es"

import { IGear } from "../Gear"

import { nonNullable } from "../../utils"
import ShipNakedStats, { IBaseStats } from "./ShipNakedStats"

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IShipStats extends IBaseStats {
  statsBonus?: IBaseStats
}

export default class ShipStats implements IShipStats {
  constructor(
    private readonly nakedStats: ShipNakedStats,
    private readonly gears: Array<IGear | undefined>,
    public statsBonus?: IBaseStats
  ) {}

  private getStat(statKey: keyof Omit<IBaseStats, "luck" | "hp">) {
    const { nakedStats, gears, statsBonus } = this
    let bonus = 0
    if (statsBonus !== undefined) {
      bonus = statsBonus[statKey]
    }
    return nakedStats[statKey] + sumBy(gears.filter(nonNullable), statKey) + bonus
  }

  get hp() {
    return this.nakedStats.hp
  }

  get firepower() {
    return this.getStat("firepower")
  }

  get torpedo() {
    return this.getStat("torpedo")
  }

  get antiAir() {
    return this.getStat("antiAir")
  }

  get armor() {
    return this.getStat("armor")
  }

  get los() {
    return this.getStat("los")
  }

  get asw() {
    return this.getStat("asw")
  }

  get evasion() {
    return this.getStat("evasion")
  }

  get luck() {
    return this.nakedStats.luck
  }

  get speed() {
    return this.getStat("speed")
  }

  get range() {
    const { nakedStats, gears, statsBonus } = this
    const nakedRange = nakedStats.range
    const longest = maxBy(gears, "range")
    const range = longest && longest.range > nakedRange ? longest.range : nakedRange

    if (statsBonus === undefined) {
      return range
    }

    return range + statsBonus.range
  }
}
