import { calcHpAtLevel } from "./formulas"

type IShipStat = {
  left: number
  right: number
  equipment: number
  modernization: number

  naked: number
  displayed: number
}

class ShipStat implements IShipStat {
  constructor(
    public tag: string,
    public left: number,
    public right: number,
    public equipment: number,
    public modernization = 0
  ) {}

  get naked() {
    const { right, modernization } = this
    return right + modernization
  }

  get displayed() {
    return this.naked + this.equipment
  }
}

class LevelStat implements IShipStat {
  constructor(
    public tag: "asw" | "evasion" | "los",
    public left: number,
    public right: number,
    public equipment: number,
    public level: number,
    public modernization = 0
  ) {}

  get naked() {
    const { left, right, level, modernization } = this
    const step = (right - left) / 99
    return left + Math.floor(step * level) + modernization
  }

  get displayed() {
    return this.naked + this.equipment
  }
}

class Health implements IShipStat {
  public readonly tag = "hp"
  constructor(
    public left: number,
    public right: number,
    public equipment: number,
    public level: number,
    public current: number,
    public modernization = 0
  ) {}

  get naked() {
    const { left, right, level, modernization } = this
    return calcHpAtLevel([left, right], level) + modernization
  }

  get max() {
    return this.naked
  }

  get displayed() {
    return this.naked + this.equipment
  }
}

const shipNumberStatKeys = [
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
] as const
