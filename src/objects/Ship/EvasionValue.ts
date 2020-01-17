import { Formation } from "../../common"
import { IShip } from "./ship"

export interface IEvasionValue {
  toNumber: () => number
}

export default class EvasionValue {
  constructor(private readonly ship: IShip) {}

  public cappedEvasionValue(formationModifier: number) {
    const { evasion, luck } = this.ship.stats
    const base = Math.floor((evasion + Math.sqrt(2 * luck)) * formationModifier)

    if (base >= 65) {
      return Math.floor(55 + 2 * Math.sqrt(base - 65))
    }
    if (base >= 40) {
      return Math.floor(40 + 3 * Math.sqrt(base - 40))
    }
    return base
  }
}
