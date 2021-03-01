import { softcap } from "../../utils"

type AirstrikeBasicPowerFactors = {
  stat: number
  planeCount: number
  fleetConstant: number
  planeTypeModifier: number
}

type AirstrikePowerPostCapModifiers = {
  antiInstallationModifier: number
  criticalModifier: number
  proficiencyModifier: number
  contactModifier: number
}

type AirstrikePowerFactors = AirstrikeBasicPowerFactors & AirstrikePowerPostCapModifiers

const calcAirstrikeBasicPower = (factors: AirstrikeBasicPowerFactors) => {
  const { stat, planeCount, fleetConstant, planeTypeModifier } = factors
  return planeTypeModifier * (stat * Math.sqrt(planeCount) + fleetConstant)
}

const calcAirstrikePower = (cappedPower: number, modifiers: AirstrikePowerPostCapModifiers) => {
  const { antiInstallationModifier, criticalModifier, proficiencyModifier, contactModifier } = modifiers
  let power = Math.floor(cappedPower * antiInstallationModifier)
  if (criticalModifier > 1) {
    power *= Math.floor(criticalModifier * proficiencyModifier)
  }
  return Math.floor(power * contactModifier)
}

export const getAirstrikePower = (factors: AirstrikePowerFactors) => {
  const basicPower = calcAirstrikeBasicPower(factors)
  const cappedPower = softcap(170, basicPower)
  const value = calcAirstrikePower(cappedPower, factors)

  return {
    ...factors,
    basicPower,
    cappedPower,
    value
  }
}
