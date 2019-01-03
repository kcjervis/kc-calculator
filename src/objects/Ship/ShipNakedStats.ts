import { MasterShip } from '../../data'

export interface IBaseStats {
  hp: number

  armor: number
  firepower: number
  torpedo: number
  antiAir: number

  asw: number
  los: number
  evasion: number

  luck: number
  speed: number

  range: number
}

export interface IShipNakedStats extends IBaseStats {
  level: number
}

const calculateStatAtLevel = (stats: [number, number], level: number) => {
  const min = stats[0]
  const max = stats[1]
  return Math.floor(((max - min) * level) / 99 + min)
}

export default class ShipNakedStats implements IShipNakedStats {
  constructor(private readonly master: MasterShip, public level: number, private increased?: Partial<IBaseStats>) {}

  private getIncreasedStat(statName: keyof IBaseStats) {
    const { increased } = this
    if (!increased) {
      return 0
    }
    const value = increased[statName]
    if (!value) {
      return 0
    }
    return value
  }

  get hp() {
    let maxHp = this.master.hp[0]
    const limitHp = this.master.hp[1]
    if (this.level >= 100) {
      const unmarriedHp = this.master.hp[0]
      if (unmarriedHp >= 91) {
        maxHp += 9
      } else if (unmarriedHp >= 70) {
        maxHp += 8
      } else if (unmarriedHp >= 50) {
        maxHp += 7
      } else if (unmarriedHp >= 40) {
        maxHp += 6
      } else if (unmarriedHp >= 30) {
        maxHp += 5
      } else if (unmarriedHp >= 8) {
        maxHp += 4
      } else {
        maxHp += 3
      }
    }
    return Math.min(maxHp, limitHp) + this.getIncreasedStat('hp')
  }

  get firepower() {
    return this.master.firepower[1] + this.getIncreasedStat('firepower')
  }
  get torpedo() {
    return this.master.torpedo[1] + this.getIncreasedStat('torpedo')
  }

  get antiAir() {
    return this.master.antiAir[1] + this.getIncreasedStat('antiAir')
  }

  get armor() {
    return this.master.armor[1] + this.getIncreasedStat('armor')
  }

  get los() {
    return calculateStatAtLevel(this.master.los, this.level) + this.getIncreasedStat('los')
  }
  get asw() {
    return calculateStatAtLevel(this.master.asw, this.level) + this.getIncreasedStat('asw')
  }
  get evasion() {
    return calculateStatAtLevel(this.master.evasion, this.level) + this.getIncreasedStat('evasion')
  }

  get luck() {
    // とりあえず初期値
    return this.master.luck[0] + this.getIncreasedStat('luck')
  }

  get speed() {
    return this.master.speed + this.getIncreasedStat('speed')
  }

  get range() {
    return this.master.range + this.getIncreasedStat('range')
  }
}
