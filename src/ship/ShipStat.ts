import { calcHpAtLevel, calcStatAtLevel } from "../formulas"
import { includes } from "../utils"

const basicStatTags = ["firepower", "armor", "torpedo", "antiAir"] as const
type BasicStatTag = typeof basicStatTags[number]
const increasingStatTags = ["asw", "evasion", "los"] as const
type IncreasingStatTag = typeof increasingStatTags[number]

export type ShipStatTag = BasicStatTag | IncreasingStatTag | "maxHp" | "luck"

export type ShipStatObject = {
  tag: ShipStatTag

  left: number
  right: number
  equipment: number
  modernization: number

  naked: number
  displayed: number
}

class BasicStat implements ShipStatObject {
  constructor(
    public tag: BasicStatTag,
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

class IncreasingStat implements ShipStatObject {
  constructor(
    public tag: IncreasingStatTag,
    public left: number,
    public right: number,
    public equipment: number,
    public level: number,
    public modernization = 0
  ) {}

  get naked() {
    const { left, right, level, modernization } = this
    return calcStatAtLevel([left, right], level) + modernization
  }

  get displayed() {
    return this.naked + this.equipment
  }
}

class MaxHp implements ShipStatObject {
  public readonly tag = "maxHp"
  constructor(
    public left: number,
    public right: number,
    public equipment: number,
    public level: number,
    public current: number,
    public modernization = 0
  ) {}

  get limit() {
    return this.right
  }

  get naked() {
    const { left, right, level, modernization } = this
    return calcHpAtLevel([left, right], level) + modernization
  }

  get displayed() {
    return this.naked + this.equipment
  }
}

class Luck implements ShipStatObject {
  public readonly tag = "luck"
  public equipment = 0
  constructor(public left: number, public right: number, public modernization = 0) {}

  get naked() {
    return this.left + this.modernization
  }

  get displayed() {
    return this.naked
  }
}
