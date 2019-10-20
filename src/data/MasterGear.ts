import { MstEquipment, GearId } from "@jervis/data"
import { PickByValue } from "utility-types"
import { GearStats } from "../types"
import GearCategory, { GearCategoryId } from "./GearCategory"
import GearAttribute from "./GearAttribute"

export type GearStatKey = keyof PickByValue<GearStats, number>

export const gearStatKeys: GearStatKey[] = [
  "armor",
  "firepower",
  "torpedo",
  "speed",
  "bombing",
  "antiAir",
  "asw",
  "los",
  "accuracy",
  "evasion",
  "interception",
  "antiBomber",
  "range",
  "radius"
]

export default class MasterGear implements GearStats {
  public readonly id: GearId
  public readonly name: string
  public readonly categoryId: number
  public readonly iconId: number

  public readonly hp: number
  public readonly armor: number
  public readonly firepower: number
  public readonly torpedo: number
  public readonly speed: number
  public readonly bombing: number
  public readonly antiAir: number
  public readonly asw: number
  public readonly los: number
  public readonly luck: number
  public readonly range: number

  public readonly accuracy: number
  public readonly antiBomber: number
  public readonly evasion: number
  public readonly interception: number

  public readonly radius: number = 0

  public readonly attrs: GearAttribute[]

  constructor(raw: MstEquipment, public readonly category: GearCategory, public readonly improvable: boolean) {
    this.id = raw.api_id
    this.name = raw.api_name
    this.categoryId = category.id
    this.iconId = raw.api_type[3]

    this.hp = raw.api_taik
    this.armor = raw.api_souk
    this.firepower = raw.api_houg
    this.torpedo = raw.api_raig
    this.speed = raw.api_soku
    this.bombing = raw.api_baku
    this.antiAir = raw.api_tyku
    this.asw = raw.api_tais
    this.los = raw.api_saku
    this.luck = raw.api_luck
    this.range = raw.api_leng

    const accuracy = raw.api_houm
    const evasion = raw.api_houk

    this.accuracy = 0
    this.evasion = 0
    this.antiBomber = 0
    this.interception = 0

    if (this.categoryId === GearCategoryId.LandBasedFighter) {
      this.antiBomber = accuracy
      this.interception = evasion
    } else {
      this.accuracy = accuracy
      this.evasion = evasion
    }
    if (raw.api_distance) {
      this.radius = raw.api_distance
    }

    this.attrs = GearAttribute.from(this)
  }

  get gearId() {
    return this.id
  }

  public is = (attr: GearAttribute) => this.attrs.includes(attr)
}
