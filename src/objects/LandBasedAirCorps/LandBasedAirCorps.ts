import { IEquipment } from '../Equipment'
import { createPlanes, IPlane } from '../Plane'

export interface ILandBasedAirCorps {
  slots: number[]
  equipments: Array<IEquipment | undefined>
  planes: IPlane[]
}

export default class LandBasedAirCorps implements ILandBasedAirCorps {
  public readonly planes: IPlane[]
  constructor(public readonly slots: number[], public readonly equipments: Array<IEquipment | undefined>) {
    this.planes = createPlanes(slots, equipments)
  }
}
