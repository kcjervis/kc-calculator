import { MstEquipment } from '@jervis/data'
import GearCategory from './GearCategory'
import GearCategoryId from './GearCategoryId'

interface IGearData {
  id: number
  name: string
  typeIds: Readonly<number[]>
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

  public readonly typeIds: Readonly<number[]>

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

    this.typeIds = raw.api_type

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
    if (this.typeIds[2] === GearCategoryId.LandBasedFighter) {
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

  get categoryId() {
    return this.typeIds[2]
  }

  get iconId() {
    return this.typeIds[3]
  }

  get isHighAngleMount() {
    return this.iconId === 16
  }
}
