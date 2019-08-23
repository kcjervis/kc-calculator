import { MstEquipment } from "@jervis/data"
import GearCategory, { GearCategoryKey } from "./GearCategory"

interface IGearData {
  id: number
  name: string
  categoryId: number
  iconId: number

  improvable: boolean

  hp?: number
  armor?: number
  firepower?: number
  torpedo?: number
  speed?: number
  bombing?: number
  antiAir?: number
  asw?: number
  accuracy?: number
  evasion?: number
  los?: number
  luck?: number
  range?: number
  radius?: number
}

export default class MasterGear implements IGearData {
  public static readonly abyssalIdFrom = 500

  public readonly id: number
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

  private categoryIn = this.category.either

  public isHighAngleMount = () => this.iconId === 16

  public isRadar = () => this.categoryIn("SmallRadar", "LargeRadar", "LargeRadar2")

  public isSurfaceRadar = () => this.isRadar() && this.los >= 5

  public isAirRadar = () => this.isRadar() && this.antiAir >= 2

  /**
   * 対地艦爆
   * id60 零式艦戦62型(爆戦)
   * id64 Ju87C改
   * id148 試製南山
   * id233 F4U-1D
   * id277 FM-2
   * id305 Ju87C改二(KMX搭載機)
   * id306 Ju87C改二(KMX搭載機/熟練)
   * id319 彗星一二型(六三四空/三号爆弾搭載機)
   */
  public isAntiInstallationBomber = () => [60, 64, 148, 233, 277, 305, 306, 319].includes(this.id)
}
