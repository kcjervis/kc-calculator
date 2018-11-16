import { FleetRole, FleetType, Side } from '../../constants'
import { IShipDataObject, ShipFactory } from '../Ship'

import BaseFleet from './BaseFleet'
import Fleet from './Fleet'
import FleetAerialCombat from './FleetAerialCombat'
import FleetInformation from './FleetInformation'

export interface IFleetDataObject {
  fleetType: FleetType
  fleetRole: FleetRole
  ships: Array<IShipDataObject | undefined>
}

export default class FleetFactory {
  constructor(private readonly shipFactory: ShipFactory) {}

  public create(obj: IFleetDataObject, side: Side) {
    const { fleetType, fleetRole, ships: shipObjs } = obj

    const ships = shipObjs.map((shipObj, index) => {
      if (!shipObj) {
        return undefined
      }
      const ship = this.shipFactory.create(shipObj, new FleetInformation(index, side, fleetType, fleetRole))
      return ship
    })
    const baseFleet = new BaseFleet(side, fleetType, fleetRole, ships)
    const aerialCombat = new FleetAerialCombat(baseFleet)

    return new Fleet(baseFleet, aerialCombat)
  }
}
