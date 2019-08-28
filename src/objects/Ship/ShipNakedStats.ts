import { MasterShip } from "../../data"
import { calcHpAtLevel, calcStatAtLevel } from "../../formulas"

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

export type ShipStatKey = keyof IBaseStats

export const shipStatKeys: ShipStatKey[] = [
  "hp",
  "firepower",

  "armor",
  "torpedo",

  "evasion",
  "antiAir",

  "asw",

  "speed",
  "los",

  "range",
  "luck"
]

export interface IShipNakedStats extends IBaseStats {
  level: number
}

export default class ShipNakedStats implements IShipNakedStats {
  constructor(private readonly master: MasterShip, public level: number, private increased?: Partial<IBaseStats>) {}

  private getIncreasedStat(statKey: keyof IBaseStats): number {
    const { increased } = this
    if (!increased) {
      return 0
    }
    const stat = increased[statKey]
    if (!stat) {
      return 0
    }
    if (stat > 100000) {
      return 100000
    }
    return stat
  }

  get hp() {
    return calcHpAtLevel(this.master.hp, this.level) + this.getIncreasedStat("hp")
  }

  get firepower() {
    return this.master.firepower[1] + this.getIncreasedStat("firepower")
  }
  get torpedo() {
    return this.master.torpedo[1] + this.getIncreasedStat("torpedo")
  }

  get antiAir() {
    return this.master.antiAir[1] + this.getIncreasedStat("antiAir")
  }

  get armor() {
    return this.master.armor[1] + this.getIncreasedStat("armor")
  }

  get los() {
    return calcStatAtLevel(this.master.los, this.level) + this.getIncreasedStat("los")
  }
  get asw() {
    return calcStatAtLevel(this.master.asw, this.level) + this.getIncreasedStat("asw")
  }
  get evasion() {
    return calcStatAtLevel(this.master.evasion, this.level) + this.getIncreasedStat("evasion")
  }

  get luck() {
    // とりあえず初期値
    return this.master.luck[0] + this.getIncreasedStat("luck")
  }

  get speed() {
    return this.master.speed + this.getIncreasedStat("speed")
  }

  get range() {
    return this.master.range + this.getIncreasedStat("range")
  }
}
