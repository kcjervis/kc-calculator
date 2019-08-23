import { IShipDataObject, ShipFactory } from "../Ship"

import Fleet from "./Fleet"

export interface IFleetDataObject {
  ships: Array<IShipDataObject | undefined>
}

export default class FleetFactory {
  constructor(private readonly shipFactory: ShipFactory) {}

  public create = (obj: IFleetDataObject) => {
    const { ships: shipObjs } = obj
    const ships = shipObjs.map(this.shipFactory.create)

    const fleet = new Fleet(ships)

    return fleet
  }
}
