import { MstEquipment, GearId } from "@jervis/data"
import { PickByValue } from "utility-types"
import GearCategory from "./GearCategory"

export type GearStats = {
  category: GearCategory

  categoryId: number
  iconId: number
  name: string

  hp: number
  firepower: number
  armor: number
  torpedo: number
  antiAir: number
  speed: number
  bombing: number
  asw: number
  los: number
  luck: number
  range: number
  accuracy: number
  evasion: number
  antiBomber: number
  interception: number
  radius: number

  improvable: boolean
}
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
  public static readonly abyssalIdFrom = 500

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

  constructor(raw: MstEquipment, public readonly category: GearCategory, public readonly improvable: boolean) {
    this.id = raw.api_id
    this.name = raw.api_name
    this.categoryId = raw.api_type[2]
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
    if (this.category.is("LandBasedFighter")) {
      this.antiBomber = accuracy
      this.interception = evasion
    } else {
      this.accuracy = accuracy
      this.evasion = evasion
    }
    if (raw.api_distance) {
      this.radius = raw.api_distance
    }
  }

  get isAbyssal() {
    return MasterGear.abyssalIdFrom < this.id
  }

  private categoryIn = this.category.either

  get isHighAngleMount() {
    return this.iconId === 16
  }

  get isRadar() {
    return this.categoryIn("SmallRadar", "LargeRadar", "LargeRadar2")
  }

  get isSurfaceRadar() {
    return this.isRadar && this.los >= 5
  }

  get isAirRadar() {
    return this.isRadar && this.antiAir >= 2
  }

  /**
   * 対地艦爆
   */
  get isAntiInstallationBomber() {
    return [
      GearId["零式艦戦62型(爆戦)"],
      GearId["Ju87C改"],
      GearId["Ju87C改二(KMX搭載機)"],
      GearId["Ju87C改二(KMX搭載機/熟練)"],
      GearId["試製南山"],
      GearId["F4U-1D"],
      GearId["FM-2"],
      GearId["彗星一二型(六三四空/三号爆弾搭載機)"]
    ].includes(this.id)
  }

  /** 戦闘機 */
  get isFighter() {
    return this.categoryIn("CarrierBasedFighterAircraft", "SeaplaneFighter", "LandBasedFighter", "JetPoweredFighter")
  }
}
