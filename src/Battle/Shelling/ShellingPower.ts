import { softcap, merge } from "../../utils"
import {
  AntiInstallationModifiers,
  ShellingType,
  ShellingBasicPowerFactors,
  ShellingPowerPreCapModifiers,
  ShellingPowerPostCapModifiers,
  ShellingPowerFactors,
  ShellingPowerInformation
} from "../../types"

const calcCarrierShellingBasicPower = (basicPower: number, factors: ShellingBasicPowerFactors) => {
  const { bombing, torpedo } = factors
  const airPower = basicPower + Math.floor(Math.floor(1.3 * bombing) + torpedo) + 15
  return 25 + Math.floor(1.5 * airPower)
}

export const calcBasicPower = (factors: ShellingBasicPowerFactors) => {
  const { shellingType, firepower, combinedFleetFactor, improvementModifier } = factors
  const basicPower = 5 + firepower + combinedFleetFactor + improvementModifier

  if (shellingType === "CarrierShelling") {
    return calcCarrierShellingBasicPower(basicPower, factors)
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

  const { b12, a13, b13, a13next, b13next } = antiInstallationModifiers
  const antiInstallationModified = ((basicPower + b12) * a13 + b13) * a13next + b13next

  return antiInstallationModified * formationModifier * engagementModifier * healthModifier + cruiserFitBonus
}

export const calcPower = (cappedPower: number, modifiers: ShellingPowerPostCapModifiers) => {
  const {
    effectivenessMultiplicative,
    effectivenessAdditive,
    specialAttackModifier,
    apShellModifier,
    criticalModifier,
    proficiencyModifier,
    eventMapModifier
  } = modifiers

  let postcap = Math.floor(cappedPower) * specialAttackModifier

  if (effectivenessMultiplicative > 1 || effectivenessAdditive > 0) {
    postcap = Math.floor(postcap * effectivenessMultiplicative) + effectivenessAdditive
  }

  // 要修正
  if (apShellModifier > 1) {
    postcap = Math.floor(postcap * apShellModifier)
  }

  if (criticalModifier > 1) {
    postcap = Math.floor(postcap * criticalModifier * proficiencyModifier)
  }
  return postcap * eventMapModifier
}

export default class ShellingPower implements ShellingPowerInformation {
  public static readonly cap = 180

  public shellingType: ShellingType = "Shelling"
  public firepower = 0
  public torpedo = 0
  public bombing = 0
  public improvementModifier = 0
  public combinedFleetFactor = 0

  public formationModifier = 1
  public engagementModifier = 1
  public healthModifier = 1
  public cruiserFitBonus = 0

  public effectivenessMultiplicative = 1
  public effectivenessAdditive = 0
  public specialAttackModifier = 1
  public apShellModifier = 1
  public criticalModifier = 1
  public proficiencyModifier = 1

  public eventMapModifier = 1

  public antiInstallationModifiers: AntiInstallationModifiers = {
    b12: 0,
    a13: 1,
    b13: 0,
    a13next: 1,
    b13next: 0
  }

  constructor(factors: Partial<ShellingPowerFactors>) {
    merge(this, factors)
  }

  get basicPower() {
    return calcBasicPower(this)
  }

  get precapPower() {
    return calcPreCapPower(this.basicPower, this)
  }

  get cappedPower() {
    return softcap(ShellingPower.cap, this.precapPower)
  }

  get isCapped() {
    return this.precapPower > ShellingPower.cap
  }

  get value() {
    return calcPower(this.cappedPower, this)
  }
}
