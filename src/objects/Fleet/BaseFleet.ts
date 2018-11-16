import { FleetRole, FleetType, Side } from '../../constants'
import { IShip } from '../Ship'

export interface IBaseFleet {
  ships: Array<IShip | undefined>
  side: Side
  fleetType: FleetType
  fleetRole: FleetRole
}

export default class BaseFleet implements IBaseFleet {
  constructor(
    public readonly side: Side,
    public readonly fleetType: FleetType,
    public readonly fleetRole: FleetRole,
    public readonly ships: Array<IShip | undefined>
  ) {}
}
