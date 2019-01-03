import { EquipmentFactory, IEquipmentDataObject } from '../Equipment'
import LandBasedAirCorps from './LandBasedAirCorps'

export interface ILandBasedAirCorpsDataObject {
  equipments: Array<IEquipmentDataObject | undefined>
  slots: number[]
}

export default class LandBasedAirCorpsFactory {
  constructor(private readonly equipmentFactory: EquipmentFactory) {}

  public create = (obj: ILandBasedAirCorpsDataObject) => {
    const { equipments: equipObjs } = obj
    const slots = obj.slots.concat()
    const equipments = equipObjs.map(this.equipmentFactory.create)
    const airCorps = new LandBasedAirCorps(slots, equipments)

    return airCorps
  }
}
