import { EquipmentCategory, MasterEquipment } from '../../data'
import { IImprovement } from './Improvement'
import { IProficiency } from './Proficiency'

export interface IEquipmentStats {
  hp: number
  armor: number
  firepower: number
  torpedo: number
  speed: number
  bombing: number
  antiAir: number
  asw: number
  los: number
  accuracy: number
  evasion: number
  interception: number
  antiBomber: number
  luck: number
  range: number
  radius: number
}

export const equipmentStatKeys: Array<keyof IEquipmentStats> = [
  'hp',
  'armor',
  'firepower',
  'torpedo',
  'speed',
  'bombing',
  'antiAir',
  'asw',
  'accuracy',
  'evasion',
  'interception',
  'antiBomber',
  'range',
  'radius'
]

export interface IEquipment extends IEquipmentStats {
  /** 装備ID */
  masterId: number
  name: string

  category: EquipmentCategory
  iconId: number

  /** 改修度 */
  improvement: IImprovement

  /** 熟練度 */
  proficiency: IProficiency

  isHighAngleMount: boolean

  isSurfaceRadar: boolean

  isAntiAirRadar: boolean
}

export default class Equipment implements IEquipment {
  constructor(
    private readonly master: MasterEquipment,
    public readonly improvement: IImprovement,
    public readonly proficiency: IProficiency
  ) {}

  get masterId() {
    return this.master.id
  }

  get name() {
    return this.master.name
  }

  get category() {
    return this.master.category
  }

  get iconId() {
    return this.master.iconId
  }

  get hp() {
    return this.master.hp
  }

  get armor() {
    return this.master.armor
  }

  get firepower() {
    return this.master.firepower
  }

  get torpedo() {
    return this.master.torpedo
  }

  get speed() {
    return this.master.speed
  }

  get bombing() {
    return this.master.bombing
  }

  get antiAir() {
    return this.master.antiAir
  }

  get asw() {
    return this.master.asw
  }

  get accuracy() {
    return this.master.accuracy
  }

  get interception() {
    return this.master.interception
  }

  get evasion() {
    return this.master.evasion
  }

  get antiBomber() {
    return this.master.antiBomber
  }

  get los() {
    return this.master.los
  }

  get luck() {
    return this.master.luck
  }

  get range() {
    return this.master.range
  }

  get radius() {
    return this.master.radius
  }

  get isAbyssal() {
    return this.masterId > 500
  }

  get isHighAngleMount() {
    return this.iconId === 16
  }

  get isSurfaceRadar() {
    const { category, los } = this
    return category.isRadar && los >= 5
  }

  get isAntiAirRadar() {
    const { category, antiAir } = this
    return category.isRadar && antiAir >= 2
  }
}
