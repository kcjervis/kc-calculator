import { FleetTypeName, Side } from "../../constants"
import { IFleet } from "../Fleet"
import { ILandBasedAirCorps } from "../LandBasedAirCorps"

export interface IOperation {
  side: Side
  fleetType: FleetTypeName
  fleets: IFleet[]
  landBase: ILandBasedAirCorps[]

  mainFleet: IFleet
  escortFleet?: IFleet

  isCombinedFleetOperation: boolean
}

export default class Operation implements IOperation {
  constructor(
    public readonly side: Side,
    public readonly fleetType: FleetTypeName,
    public readonly fleets: IFleet[],
    public readonly landBase: ILandBasedAirCorps[]
  ) {}

  get mainFleet() {
    return this.fleets[0]
  }

  get escortFleet() {
    if (this.isCombinedFleetOperation) {
      return this.fleets[1]
    }
    return undefined
  }

  get isCombinedFleetOperation() {
    return this.fleetType !== FleetTypeName.Single
  }
}
