import { Formation } from '../constants'
import { IShip } from '../objects'

const calcEvasionBaseValue = (ship: IShip, formationModifier: number) => {
  return (ship.stats.evasion + Math.sqrt(2 * ship.stats.luck)) * formationModifier
}

type PostCapModifier = number | ((postCap: number, ship: IShip) => number)

const calcEvasionValue = (ship: IShip, formationModifier: number, postCapModifier: PostCapModifier) => {
  const baseValue = (ship.stats.evasion + Math.sqrt(2 * ship.stats.luck)) * formationModifier
  let postCap = baseValue
  if (baseValue >= 65) {
    postCap = Math.floor(55 + 2 * Math.sqrt(baseValue - 65))
  } else if (baseValue >= 40) {
    postCap = Math.floor(40 + 3 * Math.sqrt(baseValue - 40))
  }

  if (typeof postCapModifier === 'number') {
    return Math.floor(postCap + postCapModifier)
  }
  return Math.floor(postCapModifier(postCap, ship))
}

export default class Evasion {
  public static calcEvasionValue = calcEvasionValue
}
