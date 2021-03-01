import {
  AttackPowerModifierRecord,
  composeAttackPowerModifierRecord,
  FunctionalModifier,
  createAttackPower
} from "../common"

export type AswPowerFactors = {
  nakedAsw: number
  equipmentAsw: number
  improvementModifier: number
  typeConstant: number

  formationModifier: number
  engagementModifier: number
  healthModifier: number

  synergyModifier: number

  optionalModifiers?: AttackPowerModifierRecord
  fm11next?: FunctionalModifier
}

const createPower = (factors: AswPowerFactors) => {
  const {
    nakedAsw,
    equipmentAsw,
    improvementModifier,
    typeConstant,

    formationModifier,
    engagementModifier,
    healthModifier,
    synergyModifier,
    optionalModifiers,
    fm11next
  } = factors

  const basic = Math.sqrt(nakedAsw) * 2 + equipmentAsw * 1.5 + improvementModifier + typeConstant
  const cap = 170
  const a14 = formationModifier * engagementModifier * healthModifier * synergyModifier
  const modifiers = optionalModifiers ? composeAttackPowerModifierRecord(optionalModifiers, { a14 }) : { a14 }

  return createAttackPower({ basic, cap, modifiers, fm11next })
}

type AccuracyFactors = {
  shipAccuracy: number
  aswEquipmentModifier: number
  improvementModifier: number

  formationModifier: number
  moraleModifier: number
}

const calcAccuracy = (factors: AccuracyFactors) => {
  const { shipAccuracy, aswEquipmentModifier, improvementModifier, formationModifier, moraleModifier } = factors
  const constant = 80

  return (constant + shipAccuracy + aswEquipmentModifier + improvementModifier) * formationModifier * moraleModifier
}

export const Asw = {
  createPower,
  calcAccuracy
}
