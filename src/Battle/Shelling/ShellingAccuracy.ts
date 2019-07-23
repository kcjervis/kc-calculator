import { merge } from '../../utils'
import {
  ShellingBasicAccuracyFactors,
  ShellingAccuracyModifiers,
  ShellingAccuracyFactors,
  ShellingAccuracyInformation
} from '../../types'

export const calcShellingBasicAccuracy = (factors: ShellingBasicAccuracyFactors) => {
  const { combinedFleetFactor, level, luck, equipmentAccuracy, improvementModifier } = factors
  return Math.floor(
    90 + combinedFleetFactor + 2 * Math.sqrt(level) + 1.5 * Math.sqrt(luck) + equipmentAccuracy + improvementModifier
  )
}

export const calcShellingAccuracy = (basicAccuracy: number, modifiers: ShellingAccuracyModifiers) => {
  const { formationModifier, moraleModifier, fitGunBonus, specialAttackModifier, apShellModifier } = modifiers
  return Math.floor(
    (basicAccuracy * formationModifier * moraleModifier + fitGunBonus) * specialAttackModifier * apShellModifier
  )
}

export default class ShellingAccuracy implements ShellingAccuracyInformation {
  public combinedFleetFactor = 0

  public level = 0
  public luck = 0
  public equipmentAccuracy = 0
  public improvementModifier = 0

  public formationModifier = 1
  public moraleModifier = 1
  public fitGunBonus = 0
  public specialAttackModifier = 1
  public apShellModifier = 1

  constructor(factors: Partial<ShellingAccuracyFactors>) {
    merge(this, factors)
  }

  get basicAccuracy() {
    return calcShellingBasicAccuracy(this)
  }

  get value() {
    return calcShellingAccuracy(this.basicAccuracy, this)
  }
}
