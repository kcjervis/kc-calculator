import { Side } from '../../constants'
import { FleetFactory, IFleetDataObject } from '../Fleet'
import { ILandBasedAirCorpsDataObject, LandBasedAirCorpsFactory } from '../LandBasedAirCorps'
import Operation from './Operation'

export interface IOperationDataObject {
  side: Side
  fleets: IFleetDataObject[]
  landBase: ILandBasedAirCorpsDataObject[]
}

export default class OperationFactory {
  constructor(
    private readonly fleetFactory: FleetFactory,
    private readonly landBasedAirCorpsFactory: LandBasedAirCorpsFactory
  ) {}

  public create({ side, fleets: fleetObjs, landBase: airCorpsObjs }: IOperationDataObject) {
    const fleets = fleetObjs.map(fleetObj => this.fleetFactory.create(fleetObj, side))
    const landBase = airCorpsObjs.map(this.landBasedAirCorpsFactory.create)

    return new Operation(side, fleets, landBase)
  }
}
