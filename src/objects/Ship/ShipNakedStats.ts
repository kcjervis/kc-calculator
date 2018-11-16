import { ShipMaster } from '../../data'

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
  constructor(private readonly master: ShipMaster, public level: number, private increased?: Partial<IBaseStats>) {}

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
    // とりあえず初期値
    return this.master.hp[0]
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
