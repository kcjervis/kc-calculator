import { EquipmentFactory, IEquipmentDataObject } from '../Equipment'
import LandBasedAirCorps from './LandBasedAirCorps'

export interface ILandBasedAirCorpsDataObject {
  equipments: Array<IEquipmentDataObject | undefined>
  slots?: number[]
}

export default class LandBasedAirCorpsFactory {
  constructor(private readonly equipmentFactory: EquipmentFactory) {}

  public create(obj: ILandBasedAirCorpsDataObject) {
    const { equipments: equipObjs, slots = [18, 18, 18, 18] } = obj
    const equipments = equipObjs.map(equipObj => equipObj && this.equipmentFactory.create(equipObj))
    const airCorps = new LandBasedAirCorps(slots, equipments)

    return airCorps
  }
}
