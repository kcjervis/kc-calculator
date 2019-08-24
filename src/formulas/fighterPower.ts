type FighterCombatStats = {
  slotSize: number
  antiAir: number

  improvementModifier?: number
  proficiencyModifier?: number
  interception?: number
  antiBomber?: number
  isInterception?: boolean
}

export const calcFighterPower = ({
  slotSize,
  antiAir,

  interception = 0,
  antiBomber = 0,
  improvementModifier = 0,
  proficiencyModifier = 0,
  isInterception = false
}: FighterCombatStats) => {
  let multiplier = antiAir + 1.5 * interception + improvementModifier
  if (isInterception) {
    multiplier = antiAir + interception + 2 * antiBomber + improvementModifier
  }

  return Math.floor(multiplier * Math.sqrt(slotSize) + proficiencyModifier)
}
