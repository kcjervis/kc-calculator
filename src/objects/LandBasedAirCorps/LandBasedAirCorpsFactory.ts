import { GearFactory, IGearDataObject } from "../Gear"
import LandBasedAirCorps from "./LandBasedAirCorps"

export interface ILandBasedAirCorpsDataObject {
  equipments: Array<IGearDataObject | undefined>
  slots: number[]
}

export default class LandBasedAirCorpsFactory {
  constructor(private readonly gearFactory: GearFactory) {}

  public create = (obj: ILandBasedAirCorpsDataObject) => {
    const { equipments: equipObjs } = obj
    const slots = obj.slots.concat()
    const gears = equipObjs.map(this.gearFactory.create)
    const airCorps = new LandBasedAirCorps(slots, gears)

    return airCorps
  }
}
