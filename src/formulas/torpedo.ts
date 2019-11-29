import { FunctionalModifier, createAttackPower } from "./attackPower"

type TorpedoPowerFactors = {
  torpedo: number
  fleetFactor: number
  improvementModifier: number

  formationModifier: number
  engagementModifier: number
  healthModifier: number

  additionalFm?: FunctionalModifier
}

const calcPower = (factors: TorpedoPowerFactors) => {
  const {
    torpedo,
    fleetFactor,
    improvementModifier,
    formationModifier,
    engagementModifier,
    healthModifier,
    additionalFm
  } = factors
  const basic = 5 + fleetFactor + torpedo + improvementModifier
  const cap = 150
  const a14 = formationModifier * engagementModifier * healthModifier
  return createAttackPower({ basic, cap, modifiers: { a14 }, additionalFm })
}
