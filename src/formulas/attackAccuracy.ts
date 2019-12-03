type Fctors = {
  luck: number
  level: number
  typeConstant: number
  additiveModifier: number
  multiplicativeModifier: number
}

const calcAccuracy = (factors: Fctors) => {
  const { luck, level, typeConstant, additiveModifier, multiplicativeModifier } = factors
  const shipAccuracy = 2 * Math.sqrt(level) + 1.5 * Math.sqrt(luck)

  return (typeConstant + shipAccuracy + additiveModifier) * multiplicativeModifier
}
