import { IEquipment } from '../../objects'

export const equipmentFighterPowerMultiplier = (equipment: IEquipment) => {
  const { antiAir, interception, improvement } = equipment
  return antiAir + 1.5 * interception + improvement.fighterPowerModifier
}

export const equipmentInterceptionPowerMultiplier = (equipment: IEquipment) => {
  const { antiAir, interception, antiBomber, improvement } = equipment
  return antiAir + interception + 2 * antiBomber + improvement.fighterPowerModifier
}

export const equipmentFighterPower = (equipment: IEquipment, slotSize: number) => {
  if (slotSize === 0) {
    return 0
  }
  const { proficiency } = equipment
  const multiplier = equipmentFighterPowerMultiplier(equipment)
  return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
}

export const equipmentInterceptionPower = (equipment: IEquipment, slotSize: number) => {
  if (slotSize === 0) {
    return 0
  }
  const { proficiency } = equipment
  const multiplier = equipmentInterceptionPowerMultiplier(equipment)
  return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
}
