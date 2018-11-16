import { IPlane } from '../Plane'
import { IShip } from '../Ship'

import { IBaseFleet } from './BaseFleet'
import { IFleetAerialCombat } from './FleetAerialCombat'

export interface IFleet extends IBaseFleet {
  planes: IPlane[]
  aerialCombat: IFleetAerialCombat
}

export default class Fleet implements IFleet {
  constructor(private readonly baseFleet: IBaseFleet, public readonly aerialCombat: IFleetAerialCombat) {}

  get side() {
    return this.baseFleet.side
  }

  get fleetType() {
    return this.baseFleet.fleetType
  }

  get fleetRole() {
    return this.baseFleet.fleetRole
  }

  get ships() {
    return this.baseFleet.ships
  }

  get planes() {
    return this.ships.filter((ship): ship is IShip => ship !== undefined).flatMap(ship => ship.planes)
  }
}
