import EquipmentCategory from './EquipmentCategory'
import EquipmentCategoryId from './EquipmentCategoryId'

interface IEquipmentData {
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

export default class EquipmentMaster implements IEquipmentData {
  public static readonly abyssalIdFrom = 500

  public readonly id: number
  public readonly name: string

  public readonly typeIds: Readonly<number[]>
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
  public readonly radius: number

  public readonly accuracy: number
  public readonly antiBomber: number
  public readonly evasion: number
  public readonly interception: number

  constructor(equipmentData: IEquipmentData, public readonly category: EquipmentCategory) {
    const {
      id,
      name,
      typeIds,
      hp = 0,
      armor = 0,
      firepower = 0,
      torpedo = 0,
      speed = 0,
      bombing = 0,
      antiAir = 0,
      asw = 0,
      accuracy = 0,
      evasion = 0,
      los = 0,
      luck = 0,
      range = 0,
      radius = 0
    } = equipmentData

    this.id = id
    this.name = name

    this.typeIds = typeIds
    this.categoryId = this.typeIds[2]
    this.iconId = this.typeIds[3]

    this.hp = hp
    this.armor = armor
    this.firepower = firepower
    this.torpedo = torpedo
    this.speed = speed
    this.bombing = bombing
    this.antiAir = antiAir
    this.asw = asw
    this.los = los
    this.luck = luck
    this.range = range
    this.radius = radius

    this.accuracy = 0
    this.evasion = 0
    this.antiBomber = 0
    this.interception = 0
    if (this.typeIds[2] === EquipmentCategoryId.LandBasedFighter) {
      this.antiBomber = accuracy
      this.interception = evasion
    } else {
      this.accuracy = accuracy
      this.evasion = evasion
    }
  }

  get isHighAngleMount() {
    return this.iconId === 16
  }
}
