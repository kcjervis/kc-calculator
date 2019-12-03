import { NumberRecord } from "../data/SpecialEnemyModifier"
import { flow } from "lodash-es"
import { softcap } from "../utils"

export type FunctionalModifier = (value: number) => number

export const createFm = (a = 1, b = 0, floor = false): FunctionalModifier => value => {
  const result = value * a + b
  if (floor) {
    return Math.floor(result)
  }
  return result
}

export const createCriticalFm = (proficiencyModifier = 1): FunctionalModifier => value =>
  Math.floor(value * 1.5 * proficiencyModifier)

type PrecapPowerModifierPosition = "a12" | "a13" | "a13next" | "a14" | "b12" | "b13" | "b13next" | "b14"
type PrecapPowerModifiers = NumberRecord<PrecapPowerModifierPosition>

export const createPrecapFm = (modifiers: PrecapPowerModifiers): FunctionalModifier => {
  const { a12, a13, a13next, a14, b12, b13, b13next, b14 } = modifiers
  const fm12 = createFm(a12, b12)
  const fm13 = createFm(a13, b13)
  const fm13next = createFm(a13next, b13next)
  const fm14 = createFm(a14, b14)
  return flow(fm12, fm13, fm13next, fm14)
}

type PostcapPowerModifierPosition = "a5" | "a6" | "a11" | "b5" | "b6" | "b11"
type PostcapPowerModifiers = NumberRecord<PostcapPowerModifierPosition>

export const createPostcapFm = (modifiers: PostcapPowerModifiers): FunctionalModifier => {
  const { a5, a6, a11, b5, b6, b11 } = modifiers
  const fm5 = createFm(a5, b5, true)
  const fm6 = createFm(a6, b6, true)
  const fm11 = createFm(a11, b11)
  return flow(fm5, fm6, fm11)
}

export type AttackPowerFactors = {
  basic: number
  cap: number
  modifiers: PrecapPowerModifiers & PostcapPowerModifiers
  additionalFm?: FunctionalModifier
}

export const createAttackPower = ({ basic, cap, modifiers, additionalFm }: AttackPowerFactors) => {
  const precapFm = createPrecapFm(modifiers)
  const postcapFm = createPostcapFm(modifiers)

  const precap = precapFm(basic)
  const isCapped = cap < precap
  const capped = softcap(cap, precap)
  const postcap = additionalFm ? additionalFm(postcapFm(capped)) : postcapFm(capped)
  return { precap, isCapped, capped, postcap }
}
