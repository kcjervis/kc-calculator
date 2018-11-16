import { FleetRole, Side } from '../../constants'
import { IFleet } from '../Fleet'
import { ILandBasedAirCorps } from '../LandBasedAirCorps'

export interface IOperation {
  side: Side
  fleets: IFleet[]
  landBase: ILandBasedAirCorps[]

  mainFleet: IFleet
  escortFleet?: IFleet

  isCombinedFleetOperation: boolean
}

export default class Operation implements IOperation {
  constructor(
    public readonly side: Side,
    public readonly fleets: IFleet[],
    public readonly landBase: ILandBasedAirCorps[]
  ) {}

  get mainFleet() {
    const mainFleet = this.fleets.find(fleet => fleet.fleetRole === FleetRole.MainFleet)
    if (!mainFleet) {
      throw console.error('main fleet is not found')
    }
    return mainFleet
  }

  get escortFleet() {
    return this.fleets.find(fleet => fleet.fleetRole === FleetRole.EscortFleet)
  }

  get isCombinedFleetOperation() {
    const { escortFleet } = this
    return Boolean(escortFleet)
  }
}
