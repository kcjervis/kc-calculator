import { Formation } from "../constants"
import { IShip } from "../objects"

type BasicEvasionFactors = {
  evasion: number
  luck: number
  formationModifier: number
}

const calcBasicEvasion = ({ evasion, luck, formationModifier }: BasicEvasionFactors) =>
  Math.floor((evasion + Math.sqrt(2 * luck)) * formationModifier)

export const calcEvasionValue = (ship: IShip, formationModifier: number, postCapModifier = 0) => {
  const { evasion, luck } = ship.stats
  const basicEvasion = calcBasicEvasion({ evasion, luck, formationModifier })

  let postCap = basicEvasion
  if (basicEvasion >= 65) {
    postCap = Math.floor(55 + 2 * Math.sqrt(basicEvasion - 65))
  } else if (basicEvasion >= 40) {
    postCap = Math.floor(40 + 3 * Math.sqrt(basicEvasion - 40))
  }

  return Math.floor(postCap + postCapModifier)
}
