import sumBy from 'lodash/sumBy'

import EffectiveLos from '../../EffectiveLos'
import { nonNullable } from '../../utils'
import { IPlane } from '../Plane'
import { IShip } from '../Ship'

type ShipIterator<R> = (ship: IShip) => R

export interface IFleet {
  ships: Array<IShip | undefined>
  nonNullableShips: IShip[]
  planes: IPlane[]

  totalShipStats: (iteratee: ShipIterator<number>) => number

  fighterPower: number
  effectiveLos: (nodeDivaricatedFactor: number, hqLevel: number) => number
}

export default class Fleet implements IFleet {
  constructor(public readonly ships: Array<IShip | undefined>) {}

  get nonNullableShips() {
    return this.ships.filter(nonNullable)
  }

  public totalShipStats = (iteratee: ShipIterator<number>) => {
    return sumBy(this.nonNullableShips, iteratee)
  }

  get planes() {
    return this.nonNullableShips.flatMap(ship => ship.planes)
  }

  get fighterPower() {
    return sumBy(this.planes.filter(({ category }) => !category.isReconnaissanceAircraft), plane => plane.fighterPower)
  }

  public effectiveLos = (nodeDivaricatedFactor: number, hqLevel: number): number => {
    return EffectiveLos.fleetEffectiveLos(this, nodeDivaricatedFactor, hqLevel)
  }
}
