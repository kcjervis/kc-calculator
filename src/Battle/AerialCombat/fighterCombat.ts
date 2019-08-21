import { IGear } from '../../objects'

export const gearFighterPowerMultiplier = (gear: IGear) => {
  const { antiAir, interception, improvement } = gear
  return antiAir + 1.5 * interception + improvement.fighterPowerModifier
}

export const gearInterceptionPowerMultiplier = (gear: IGear) => {
  const { antiAir, interception, antiBomber, improvement } = gear
  return antiAir + interception + 2 * antiBomber + improvement.fighterPowerModifier
}

export const gearFighterPower = (gear: IGear, slotSize: number) => {
  if (slotSize === 0) {
    return 0
  }
  const { proficiency } = gear
  const multiplier = gearFighterPowerMultiplier(gear)
  return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
}

export const gearInterceptionPower = (gear: IGear, slotSize: number) => {
  if (slotSize === 0) {
    return 0
  }
  const { proficiency } = gear
  const multiplier = gearInterceptionPowerMultiplier(gear)
  return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
}
