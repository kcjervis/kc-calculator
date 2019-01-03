import { MasterEquipment } from '../../data'

import Equipment, { IEquipment } from './Equipment'
import Improvement from './Improvement'
import Proficiency from './Proficiency'

export interface IEquipmentDataObject {
  masterId: number
  improvement?: number
  proficiency?: number
}

export default class EquipmentFactory {
  constructor(private readonly masters: MasterEquipment[]) {}

  public create = (obj: IEquipmentDataObject | undefined): IEquipment | undefined => {
    if (!obj) {
      return undefined
    }
    const master = this.masters.find(({ id }) => id === obj.masterId)
    if (!master) {
      return undefined
    }

    const improvement = new Improvement(obj.improvement, master)
    const proficiency = new Proficiency(obj.proficiency, master)
    const equip = new Equipment(master, improvement, proficiency)

    return equip
  }
}
