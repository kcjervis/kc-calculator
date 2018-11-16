import { FleetRole, FleetType, Side } from '../../constants'

export interface IFleetInformation {
  position: number
  side: Side
  fleetType: FleetType
  fleetRole: FleetRole

  isCombinedFleet: boolean
}

export default class FleetInformation implements IFleetInformation {
  constructor(
    public position: number,
    public readonly side: Side,
    public readonly fleetType: FleetType,
    public readonly fleetRole: FleetRole
  ) {}

  get isCombinedFleet() {
    return this.fleetType !== FleetType.Single
  }
}
