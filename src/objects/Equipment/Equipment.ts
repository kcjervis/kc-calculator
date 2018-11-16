import { IEquipmentBase } from './BaseEquipment'
import { IEquipmentAerialCombat } from './EquipmentAerialCombat'

export interface IEquipment extends IEquipmentBase {
  aerialCombat: IEquipmentAerialCombat
}

export default class Equipment implements IEquipment {
  constructor(private readonly baseEquipment: IEquipmentBase, public readonly aerialCombat: IEquipmentAerialCombat) {}

  /** 装備ID */
  get masterId() {
    return this.baseEquipment.masterId
  }

  get name() {
    return this.baseEquipment.name
  }

  get category() {
    return this.baseEquipment.category
  }

  get iconId() {
    return this.baseEquipment.iconId
  }

  get hp() {
    return this.baseEquipment.hp
  }

  get armor() {
    return this.baseEquipment.armor
  }

  get firepower() {
    return this.baseEquipment.firepower
  }

  get torpedo() {
    return this.baseEquipment.torpedo
  }

  get speed() {
    return this.baseEquipment.speed
  }

  get bombing() {
    return this.baseEquipment.bombing
  }

  get antiAir() {
    return this.baseEquipment.antiAir
  }

  get asw() {
    return this.baseEquipment.asw
  }

  get accuracy() {
    return this.baseEquipment.accuracy
  }

  get interception() {
    return this.baseEquipment.interception
  }

  get evasion() {
    return this.baseEquipment.evasion
  }

  get antiBomber() {
    return this.baseEquipment.antiBomber
  }

  get los() {
    return this.baseEquipment.los
  }

  get luck() {
    return this.baseEquipment.luck
  }

  get range() {
    return this.baseEquipment.range
  }

  get radius() {
    return this.baseEquipment.radius
  }

  get improvement() {
    return this.baseEquipment.improvement
  }

  get proficiency() {
    return this.baseEquipment.proficiency
  }

  get isHighAngleMount() {
    return this.baseEquipment.isHighAngleMount
  }

  get isSurfaceRadar() {
    return this.baseEquipment.isSurfaceRadar
  }

  get isAntiAirRadar() {
    return this.baseEquipment.isAntiAirRadar
  }
}
