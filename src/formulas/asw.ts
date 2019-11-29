import { FunctionalModifier, createAttackPower } from "./attackPower"
import { AttackPowerModifierRecord } from "../data/SpecialEnemyModifier"

type AswBasicPowerFactors = {
  nakedAsw: number
  equipmentAsw: number
  improvementModifier: number
  typeConstant: number
}

export const calcBasicPower = ({ nakedAsw, equipmentAsw, improvementModifier, typeConstant }: AswBasicPowerFactors) => {
  return Math.sqrt(nakedAsw) * 2 + equipmentAsw * 1.5 + improvementModifier + typeConstant
}

type BasicPrecapPowerModifiers = {
  formation: number
  engagement: number
  health: number
}

type AswPrecapModifiers = BasicPrecapPowerModifiers & {
  synergy: number
}

export type AswPowerFactors = AswBasicPowerFactors & AswPrecapModifiers & { additionalFm?: FunctionalModifier }

const calcPower = (factors: AswPowerFactors, optionalModifiers?: AttackPowerModifierRecord) => {
  const { formation, engagement, health, synergy, additionalFm } = factors

  const basic = calcBasicPower(factors)
  const cap = 150
  const a14 = formation * engagement * health * synergy
  const modifiers = optionalModifiers ? AttackPowerModifierRecord.compose(optionalModifiers, { a14 }) : { a14 }

  return createAttackPower({ basic, cap, modifiers, additionalFm })
}

type AccuracyFactors = {
  luck: number
  level: number
  aswEquipmentModifier: number
  improvementModifier: number

  formationModifier: number
  moraleModifier: number
}

const calcAccuracy = (factors: AccuracyFactors) => {
  const { luck, level, aswEquipmentModifier, improvementModifier, formationModifier, moraleModifier } = factors
  const constant = 80
  const shipAccuracy = 2 * Math.sqrt(level) + 1.5 * Math.sqrt(luck)

  return (constant + shipAccuracy + aswEquipmentModifier + improvementModifier) * formationModifier * moraleModifier
}

export const Asw = {
  calcPower,
  calcAccuracy
}
