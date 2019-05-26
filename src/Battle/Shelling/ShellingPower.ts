import { softcap, merge } from '../../utils'
import {
  AntiInstallationModifiers,
  ShellingType,
  ShellingBasicPowerFactors,
  ShellingPowerPreCapModifiers,
  ShellingPowerPostCapModifiers,
  ShellingPowerFactors,
  ShellingPowerInformation
} from '../../types'

export const calcBasicPower = (factors: ShellingBasicPowerFactors) => {
  const { shellingType, firepower, combinedFleetFactor, improvementModifier, bombing, torpedo } = factors
  let basicPower = 5 + firepower + combinedFleetFactor + improvementModifier
  if (shellingType === 'CarrierShelling') {
    basicPower += Math.floor(Math.floor(1.3 * bombing) + torpedo) + 15
    basicPower = 25 + Math.floor(1.5 * basicPower)
  }
  return basicPower
}

export const calcPreCapPower = (basicPower: number, modifiers: ShellingPowerPreCapModifiers) => {
  const {
    antiInstallationModifiers,
    formationModifier,
    engagementModifier,
    healthModifier,
    cruiserFitBonus
  } = modifiers

  const { shipTypeAdditive, multiplicative, additive } = antiInstallationModifiers
  const modified = (basicPower + shipTypeAdditive) * multiplicative + additive

  return modified * formationModifier * engagementModifier * healthModifier + cruiserFitBonus
}

export const calcPower = (cappedPower: number, modifiers: ShellingPowerPostCapModifiers) => {
  const {
    specialMultiplicative,
    specialAttackModifier,
    apShellModifier,
    criticalModifier,
    proficiencyModifier
  } = modifiers

  let postCap = Math.floor(cappedPower) * specialAttackModifier
  for (const multiplier of [specialMultiplicative, apShellModifier]) {
    if (multiplier > 1) {
      postCap = Math.floor(postCap * specialMultiplicative)
    }
  }
  if (specialMultiplicative > 1) {
    postCap = Math.floor(postCap * specialMultiplicative)
  }
  if (apShellModifier > 1) {
    postCap = Math.floor(postCap * apShellModifier)
  }
  if (criticalModifier > 1) {
    postCap = Math.floor(postCap * criticalModifier * proficiencyModifier)
  }
  return postCap
}

export default class ShellingPower implements ShellingPowerInformation {
  public static readonly cap = 180

  public shellingType: ShellingType = 'Shelling'
  public firepower = 0
  public torpedo = 0
  public bombing = 0
  public improvementModifier = 0
  public combinedFleetFactor = 0

  public formationModifier = 1
  public engagementModifier = 1
  public healthModifier = 1
  public cruiserFitBonus = 0

  public specialMultiplicative = 1
  public specialAttackModifier = 1
  public apShellModifier = 1
  public criticalModifier = 1
  public proficiencyModifier = 1

  public antiInstallationModifiers: AntiInstallationModifiers = {
    shipTypeAdditive: 0,
    multiplicative: 1,
    additive: 0
  }

  constructor(factors: Partial<ShellingPowerFactors>) {
    merge(this, factors)
  }

  get basicPower() {
    return calcBasicPower(this)
  }

  get preCapPower() {
    return calcPreCapPower(this.basicPower, this)
  }

  get cappedPower() {
    return softcap(ShellingPower.cap, this.preCapPower)
  }

  get value() {
    return calcPower(this.cappedPower, this)
  }
}
