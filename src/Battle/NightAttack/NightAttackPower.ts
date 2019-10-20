import {
  AntiInstallationModifiers,
  NightAttackType,
  NightAttackBasicPowerFactors,
  NightAttackPowerPreCapModifiers,
  NightAttackPowerPostCapModifiers,
  NightAttackPowerFactors
} from "../../types"
import { softcap, merge } from "../../utils"

const calcNightAttackBasicPower = (factors: NightAttackBasicPowerFactors) => {
  const {
    nightAttackType,
    firepower,
    torpedo,
    improvementModifier,
    nightAerialAttackPower,
    nightContactModifier
  } = factors
  if (nightAttackType === "NightAerialAttack") {
    return nightAerialAttackPower + nightContactModifier
  }
  return firepower + torpedo + improvementModifier + nightContactModifier
}

const calcNightAttackPreCapPower = (basicPower: number, modifiers: NightAttackPowerPreCapModifiers) => {
  const {
    formationModifier,
    healthModifier,
    specialAttackModifier,
    cruiserFitBonus,
    antiInstallationModifiers
  } = modifiers

  const { shipTypeAdditive, a13, b13, a13d, b13d } = antiInstallationModifiers
  const antiInstallationModified = ((basicPower + shipTypeAdditive) * a13 + b13) * a13d + b13d

  return antiInstallationModified * formationModifier * healthModifier * specialAttackModifier + cruiserFitBonus
}

const calcNightAttackPower = (cappedPower: number, modifiers: NightAttackPowerPostCapModifiers) => {
  const {
    effectivenessMultiplicative,
    effectivenessAdditive,
    criticalModifier,
    proficiencyModifier,
    eventMapModifier
  } = modifiers

  let value = Math.floor(cappedPower)
  if (effectivenessMultiplicative > 1 || effectivenessAdditive > 0) {
    value = Math.floor(value * effectivenessMultiplicative + effectivenessAdditive)
  }
  if (criticalModifier > 1) {
    value = Math.floor(value * criticalModifier * proficiencyModifier)
  }
  return Math.floor(value * eventMapModifier)
}

export default class NightAttackPower implements NightAttackPowerFactors {
  public static cap = 300

  public nightAttackType: NightAttackType = "NightAttack"

  public firepower = 0
  public torpedo = 0
  public improvementModifier = 0
  public nightAerialAttackPower = 0
  public nightContactModifier = 0

  public formationModifier = 1
  public healthModifier = 1
  public specialAttackModifier = 1
  public cruiserFitBonus = 0
  public antiInstallationModifiers: AntiInstallationModifiers = {
    shipTypeAdditive: 0,
    a13: 1,
    b13: 0,
    a13d: 1,
    b13d: 0
  }

  public effectivenessMultiplicative = 1
  public effectivenessAdditive = 0
  public criticalModifier = 1
  public proficiencyModifier = 1
  public eventMapModifier = 1

  constructor(factors: Partial<NightAttackPowerFactors>) {
    merge(this, factors)
  }

  get basicPower() {
    return calcNightAttackBasicPower(this)
  }

  get preCapPower() {
    return calcNightAttackPreCapPower(this.basicPower, this)
  }

  get cappedPower() {
    return softcap(NightAttackPower.cap, this.preCapPower)
  }

  get isCapped() {
    return this.preCapPower > NightAttackPower.cap
  }

  get value() {
    return calcNightAttackPower(this.cappedPower, this)
  }
}
