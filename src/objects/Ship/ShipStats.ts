import { EquipmentCollection } from '../Equipment'

import { IStatsBonus } from './ExplicitStatsBonus'
import ShipNakedStats, { IBaseStats } from './ShipNakedStats'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IShipStats extends IBaseStats {
  statsBonus?: IStatsBonus
}

export default class ShipStats implements IShipStats {
  constructor(
    private readonly nakedStats: ShipNakedStats,
    private readonly equipmentCollection: EquipmentCollection,
    public statsBonus?: IStatsBonus
  ) {}

  private getStat(statName: keyof Omit<IBaseStats, 'hp' | 'luck'>) {
    const { nakedStats, equipmentCollection, statsBonus } = this
    let bonus = 0
    if (statsBonus !== undefined) {
      bonus = statsBonus[statName]
    }
    return nakedStats[statName] + equipmentCollection.sumBy(statName) + bonus
  }

  get hp() {
    return this.nakedStats.hp
  }

  get firepower() {
    return this.getStat('firepower')
  }

  get torpedo() {
    return this.getStat('torpedo')
  }

  get antiAir() {
    return this.getStat('antiAir')
  }

  get armor() {
    return this.getStat('armor')
  }

  get los() {
    return this.getStat('los')
  }

  get asw() {
    return this.getStat('asw')
  }

  get evasion() {
    return this.getStat('evasion')
  }

  get luck() {
    return this.nakedStats.luck
  }

  get speed() {
    return this.getStat('speed')
  }

  get range() {
    const { nakedStats, equipmentCollection, statsBonus } = this
    const nakedRange = nakedStats.range
    const longest = equipmentCollection.maxBy('range')
    const range = longest && longest.range > nakedRange ? longest.range : nakedRange

    if (statsBonus === undefined) {
      return range
    }

    return range + statsBonus.range
  }
}
