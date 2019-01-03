import { FleetType, Side } from '../../constants'
import { FleetFactory, IFleetDataObject } from '../Fleet'
import { ILandBasedAirCorpsDataObject, LandBasedAirCorpsFactory } from '../LandBasedAirCorps'
import Operation from './Operation'

export interface IOperationDataObject {
  side: Side
  fleetType: FleetType
  fleets: IFleetDataObject[]
  landBase: ILandBasedAirCorpsDataObject[]
}

export default class OperationFactory {
  constructor(
    private readonly fleetFactory: FleetFactory,
    private readonly landBasedAirCorpsFactory: LandBasedAirCorpsFactory
  ) {}

  public create(dataObj: IOperationDataObject) {
    const { side, fleetType, fleets: fleetObjs, landBase: airCorpsObjs } = dataObj

    const fleets = fleetObjs.map(this.fleetFactory.create)
    const landBase = airCorpsObjs.map(this.landBasedAirCorpsFactory.create)

    return new Operation(side, fleetType, fleets, landBase)
  }
}
