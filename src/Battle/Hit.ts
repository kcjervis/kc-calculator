import { ShipInformation } from '../types'

type AttackAccuracy = {
  value: number
}

export const calcHitRate = (accuracy: number, evasion: number, moraleModifier: number, proficiencyModifier: number) => {
  let basicRate = (accuracy - evasion) * moraleModifier
  if (basicRate < 10) {
    basicRate = 10
  }
  if (basicRate > 96) {
    basicRate = 96
  }
  return (basicRate + proficiencyModifier + 1) / 100
}
