import { IBaseShip } from '../BaseShip'

type StatKey = 'firepower' | 'torpedo' | 'antiAir' | 'armor' | 'asw' | 'los' | 'evasion' | 'speed' | 'range'
const keies: StatKey[] = ['firepower', 'torpedo', 'antiAir', 'armor', 'asw', 'los', 'evasion', 'speed', 'range']
type BonusPojo = { [K in StatKey | 'multiplier']?: number }

export type StatsBonusCreator = (ship: IBaseShip) => StatsBonus | undefined

export interface IStatsBonus {
  firepower: number
  torpedo: number
  antiAir: number
  armor: number
  asw: number
  los: number
  evasion: number
  speed: number
  range: number
}

export default class StatsBonus implements IStatsBonus {
  public firepower: number
  public torpedo: number
  public antiAir: number
  public armor: number
  public asw: number
  public los: number
  public evasion: number
  public speed: number
  public range: number
  constructor(pojo?: BonusPojo) {
    this.firepower = 0
    this.torpedo = 0
    this.antiAir = 0
    this.armor = 0
    this.asw = 0
    this.los = 0
    this.evasion = 0
    this.speed = 0
    this.range = 0

    if (pojo) {
      this.add(pojo)
    }
  }

  public add(pojo: BonusPojo) {
    const { multiplier = 1 } = pojo
    for (const key of keies) {
      const value = pojo[key]
      if (typeof value === 'number') {
        this[key] += value * multiplier
      }
    }
  }
}
