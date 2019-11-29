import { FunctionalModifier } from "./attackPower"

type EvasionValueFactors = {
  evasion: number
  luck: number
  improvementModifier: number
  formationModifier: number
  postcapModifier?: number
  additionalFm?: FunctionalModifier
}

export const calcEvasionValue = (factios: EvasionValueFactors) => {
  const { evasion, luck, improvementModifier, formationModifier, postcapModifier = 0, additionalFm } = factios
  const basicEvasion = Math.floor((evasion + Math.sqrt(2 * luck)) * formationModifier)

  let postcap = basicEvasion
  if (basicEvasion >= 65) {
    postcap = Math.floor(55 + 2 * Math.sqrt(basicEvasion - 65))
  } else if (basicEvasion >= 40) {
    postcap = Math.floor(40 + 3 * Math.sqrt(basicEvasion - 40))
  }

  const value = Math.floor(postcap + postcapModifier) + improvementModifier
  return additionalFm ? additionalFm(value) : value
}
