import { FleetTypeName } from "../../common"
import { Side } from "../../types"
import { FleetFactory, IFleetDataObject } from "../fleet"
import { ILandBasedAirCorpsDataObject, LandBasedAirCorpsFactory } from "../landBasedAirCorps"
import Operation from "./Operation"

export interface IOperationDataObject {
  side: Side
  fleetType: FleetTypeName
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
