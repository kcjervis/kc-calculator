import { flatMap, sumBy } from "lodash-es"

import EffectiveLos from "../../EffectiveLos"
import { isNonNullable } from "../../utils"
import { IPlane } from "../plane"
import { IShip } from "../ship"

type ShipIterator<R> = (ship: IShip) => R

export interface IFleet {
  ships: Array<IShip | undefined>
  nonNullableShips: IShip[]
  planes: IPlane[]

  hasUnknownSlot: boolean

  totalShipStats: (iteratee: ShipIterator<number>) => number

  fighterPower: number
  effectiveLos: (nodeDivaricatedFactor: number, hqLevel: number) => number
}

export default class Fleet implements IFleet {
  constructor(public readonly ships: Array<IShip | undefined>) {}

  get nonNullableShips() {
    return this.ships.filter(isNonNullable)
  }

  public totalShipStats = (iteratee: ShipIterator<number>) => {
    return sumBy(this.nonNullableShips, iteratee)
  }

  get planes() {
    return flatMap(this.nonNullableShips, ship => ship.planes)
  }

  get hasUnknownSlot() {
    return this.nonNullableShips.flatMap(ship => ship.slots).some(slot => slot < 0)
  }

  get fighterPower() {
    return sumBy(
      this.planes.filter(plane => !plane.is("ReconnaissanceAircraft")),
      "fighterPower"
    )
  }

  public effectiveLos = (nodeDivaricatedFactor: number, hqLevel: number): number => {
    return EffectiveLos.calcFleetEffectiveLos(this, nodeDivaricatedFactor, hqLevel)
  }
}
