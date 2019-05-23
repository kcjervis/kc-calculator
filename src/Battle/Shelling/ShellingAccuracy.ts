import { merge } from '../../utils'
import {
  ShellingBasicAccuracyFactors,
  ShellingAccuracyModifiers,
  ShellingAccuracyFactors,
  ShellingAccuracyInformation
} from '../../types'

export const calcBasicAccuracy = (factors: ShellingBasicAccuracyFactors) => {
  const { combinedFleetFactor, level, luck, equipmentAccuracy, improvementModifier } = factors
  return Math.floor(
    90 + combinedFleetFactor + 2 * Math.sqrt(level) + 1.5 * Math.sqrt(luck) + equipmentAccuracy + improvementModifier
  )
}

export const calcAccuracy = (basicAccuracy: number, modifiers: ShellingAccuracyModifiers) => {
  const { moraleModifier, formationModifier, fitGunBonus, specialAttackModifier, apShellModifier } = modifiers
  return Math.floor(
    (basicAccuracy * moraleModifier * formationModifier + fitGunBonus) * specialAttackModifier * apShellModifier
  )
}

export default class ShellingAccuracy implements ShellingAccuracyInformation {
  public combinedFleetFactor = 0

  public level = 0
  public luck = 0
  public equipmentAccuracy = 0
  public improvementModifier = 0

  public moraleModifier = 1
  public formationModifier = 1
  public fitGunBonus = 0
  public specialAttackModifier = 1
  public apShellModifier = 1

  constructor(factors: Partial<ShellingAccuracyFactors>) {
    merge(this, factors)
  }

  get basicAccuracy() {
    return calcBasicAccuracy(this)
  }

  get value() {
    return calcAccuracy(this.basicAccuracy, this)
  }
}
