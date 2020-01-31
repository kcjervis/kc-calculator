import { IFleet, IShip } from "../objects"
import DamageCounter from "./DamageCounter"

class ShipInitialState {
  private readonly initialHp: number
  private readonly initialSlots: number[]

  constructor(private ship: IShip) {
    this.initialHp = ship.health.currentHp
    this.initialSlots = ship.slots.concat()
  }

  public init = () => {
    const { ship, initialSlots } = this
    ship.health.currentHp = this.initialHp

    initialSlots.forEach((size, index) => {
      ship.slots[index] = size
    })
  }
}

export default class FleetInitialState {
  private readonly shipInitialStates: ShipInitialState[]

  constructor(fleet: IFleet) {
    this.shipInitialStates = fleet.nonNullableShips.map(ship => new ShipInitialState(ship))
  }

  public init = () => {
    this.shipInitialStates.forEach(state => state.init())
  }
}
