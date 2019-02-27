import { Formation } from '../constants'
import { IShip } from '../objects'

type Modifier<T> = number | ((preModifier: number, target?: T) => number)
type ShipModifier = Modifier<IShip>

const calcEvasionValue = (ship: IShip, formationModifier: number, postCapModifier: ShipModifier) => {
  const base = ship.stats.evasion + Math.sqrt(2 * ship.stats.luck)
  const preCap = Math.floor(base * formationModifier)

  let postCap = preCap
  if (preCap >= 65) {
    postCap = Math.floor(55 + 2 * Math.sqrt(preCap - 65))
  } else if (preCap >= 40) {
    postCap = Math.floor(40 + 3 * Math.sqrt(preCap - 40))
  }

  if (typeof postCapModifier === 'number') {
    return Math.floor(postCap + postCapModifier)
  }
  return Math.floor(postCapModifier(postCap, ship))
}

export { calcEvasionValue }
