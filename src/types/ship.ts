import { GearState } from "./gear"

type AttackModifiers = { power: number; accuracy: number }

export type ShellingType = "Shelling" | "CarrierShelling"

export type ProficiencyModifiers = { power: number; hitRate: number; criticalRate: number }

type ShipStateOption = Partial<{
  level: number

  maxHp: number
  currentHp: number

  armor: number
  firepower: number
  torpedo: number
  antiAir: number

  asw: number
  los: number
  evasion: number

  luck: number
}>

type ShipState = {
  shipId: number
} & ShipStateOption
