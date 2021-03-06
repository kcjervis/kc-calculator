import { GearCategory, GearAttribute } from "../../data"
import { IImprovement } from "./Improvement"
import { IProficiency } from "./Proficiency"
import { calcFighterPower } from "../../formulas"
import { GearStats, GearState } from "../../types"
import sift, { SiftQuery } from "sift"
import { GearId } from "@jervis/data"

export type GearQuery = GearId | SiftQuery<GearStats & { attrs: GearAttribute[]; star: number }>

export interface IGear extends GearStats, GearState {
  /** 改修 */
  improvement: IImprovement

  /** 熟練 */
  proficiency: IProficiency

  category: GearCategory

  attrs: GearAttribute[]

  is: (attr: GearAttribute) => boolean

  match: (query: GearQuery) => boolean

  calcFighterPower: (slotSize: number, isInterception?: boolean) => number
}

export default class Gear implements IGear {
  constructor(
    private readonly stats: GearStats,
    public readonly category: GearCategory,
    public readonly improvement: IImprovement,
    public readonly proficiency: IProficiency,
    public attrs: GearAttribute[]
  ) {}

  public is = (attr: GearAttribute) => this.attrs.includes(attr)

  get gearId() {
    return this.stats.gearId
  }
  get categoryId() {
    return this.stats.categoryId
  }
  get iconId() {
    return this.stats.iconId
  }

  get name() {
    return this.stats.name
  }

  get improvable() {
    return this.stats.improvable
  }

  get hp() {
    return this.stats.hp
  }
  get firepower() {
    return this.stats.firepower
  }
  get armor() {
    return this.stats.armor
  }
  get torpedo() {
    return this.stats.torpedo
  }
  get antiAir() {
    return this.stats.antiAir
  }
  get speed() {
    return this.stats.speed
  }
  get bombing() {
    return this.stats.bombing
  }
  get asw() {
    return this.stats.asw
  }
  get los() {
    return this.stats.los
  }
  get luck() {
    return this.stats.luck
  }
  get range() {
    return this.stats.range
  }
  get accuracy() {
    return this.stats.accuracy
  }
  get evasion() {
    return this.stats.evasion
  }
  get antiBomber() {
    return this.stats.antiBomber
  }
  get interception() {
    return this.stats.interception
  }
  get radius() {
    return this.stats.radius
  }

  get masterId() {
    return this.gearId
  }

  get star() {
    return this.improvement.value
  }

  get exp() {
    return this.proficiency.internal
  }

  public match = (query: GearQuery) => {
    if (typeof query === "number") {
      return this.gearId === query
    }
    return sift(query)(this)
  }

  public toState = (): GearState => ({
    gearId: this.gearId,
    star: this.star,
    exp: this.exp
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
