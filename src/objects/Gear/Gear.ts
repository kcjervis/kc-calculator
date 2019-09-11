import { GearCategory, GearStats, GearAttribute } from "../../data"
import { IImprovement } from "./Improvement"
import { IProficiency } from "./Proficiency"
import { calcFighterPower } from "../../formulas"
import { setProperties } from "../../utils"

export type GearState = {
  /** 装備ID */
  masterId: number

  /** 改修度 */
  improvement: number

  /** 内部熟練度 */
  proficiency: number
}

export interface IGear extends GearStats {
  /** 装備ID */
  masterId: number

  /** 改修度 */
  improvement: IImprovement

  /** 熟練度 */
  proficiency: IProficiency

  category: GearCategory

  is: (attr: GearAttribute) => boolean

  calcFighterPower: (slotSize: number, isInterception?: boolean) => number
}

export default class Gear implements IGear {
  public gearId: number

  public categoryId = 0
  public iconId = 0
  public name = ""

  public hp = 0
  public firepower = 0
  public armor = 0
  public torpedo = 0
  public antiAir = 0
  public speed = 0
  public bombing = 0
  public asw = 0
  public los = 0
  public luck = 0
  public range = 0
  public accuracy = 0
  public evasion = 0
  public antiBomber = 0
  public interception = 0
  public radius = 0

  public improvable = false

  constructor(
    private readonly stats: GearStats,
    public readonly category: GearCategory,
    public readonly improvement: IImprovement,
    public readonly proficiency: IProficiency,
    public is: (attr: GearAttribute) => boolean
  ) {
    this.gearId = stats.gearId

    setProperties(
      this,
      [
        "categoryId",
        "iconId",
        "name",

        "hp",
        "firepower",
        "armor",
        "torpedo",
        "antiAir",
        "speed",
        "bombing",
        "asw",
        "los",
        "luck",
        "range",
        "accuracy",
        "evasion",
        "antiBomber",
        "interception",
        "radius",

        "improvable"
      ],
      stats
    )
  }

  get masterId() {
    return this.gearId
  }

  public toState = (): GearState => ({
    masterId: this.masterId,
    improvement: this.improvement.value,
    proficiency: this.proficiency.internal
  })

  public calcFighterPower = (slotSize: number, isInterception = false) => {
    const { antiAir, interception, antiBomber, improvement, proficiency } = this

    const improvementModifier = improvement.fighterPowerModifier
    const proficiencyModifier = proficiency.fighterPowerBonus

    return calcFighterPower({
      slotSize,
      antiAir,
      interception,
      antiBomber,
      improvementModifier,
      proficiencyModifier,
      isInterception
    })
  }
}
