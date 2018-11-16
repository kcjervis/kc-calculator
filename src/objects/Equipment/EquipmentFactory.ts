import { EquipmentMaster } from '../../data'
import Collection from '../Collection'

import BaseEquipment from './BaseEquipment'
import Equipment, { IEquipment } from './Equipment'
import EquipmentAerialCombat from './EquipmentAerialCombat'
import Improvement from './Improvement'
import Proficiency from './Proficiency'

export interface IEquipmentDataObject {
  masterId: number
  improvement?: number
  proficiency?: number
}

export default class EquipmentFactory {
  constructor(private readonly masters: EquipmentMaster[]) {}

  public create(obj: IEquipmentDataObject): IEquipment | undefined {
    const master = this.masters.find(({ id }) => id === obj.masterId)
    if (!master) {
      return undefined
    }

    const improvement = new Improvement(obj.improvement, master)
    const proficiency = new Proficiency(obj.proficiency, master)
    const base = new BaseEquipment(master, improvement, proficiency)
    const aerialCombat = new EquipmentAerialCombat(base)
    const equip = new Equipment(base, aerialCombat)

    return equip
  }

  public createCollection(objs: Array<IEquipmentDataObject | undefined>) {
    const equips = objs.map(obj => obj && this.create(obj))
    return new Collection(equips)
  }
}
