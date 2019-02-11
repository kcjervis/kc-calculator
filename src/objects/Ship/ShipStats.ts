import maxBy from 'lodash/maxBy'
import sumBy from 'lodash/sumBy'

import { IEquipment } from '../Equipment'

import { nonNullable } from '../../utils'
import ShipNakedStats, { IBaseStats } from './ShipNakedStats'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface IShipStats extends IBaseStats {
  statsBonus?: IBaseStats
}

export default class ShipStats implements IShipStats {
  constructor(
    private readonly nakedStats: ShipNakedStats,
    private readonly equipments: Array<IEquipment | undefined>,
    public statsBonus?: IBaseStats
  ) {}

  private getStat(statKey: keyof Omit<IBaseStats, 'luck' | 'hp'>) {
    const { nakedStats, equipments, statsBonus } = this
    let bonus = 0
    if (statsBonus !== undefined) {
      bonus = statsBonus[statKey]
    }
    return nakedStats[statKey] + sumBy(equipments.filter(nonNullable), statKey) + bonus
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
    const { nakedStats, equipments, statsBonus } = this
    const nakedRange = nakedStats.range
    const longest = maxBy(equipments, 'range')
    const range = longest && longest.range > nakedRange ? longest.range : nakedRange

    if (statsBonus === undefined) {
      return range
    }

    return range + statsBonus.range
  }
}
