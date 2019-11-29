export type HitRateFactors = {
  accuracy: number
  evasion: number
  moraleModifier: number

  criticalRateConstant: number
  hitRateBonus?: number
  criticalRateBonus?: number
}

export const calcHitRateBase = ({ accuracy, evasion, moraleModifier }: HitRateFactors) => {
  let base = (accuracy - evasion) * moraleModifier
  if (base < 10) {
    base = 10
  }
  if (base > 96) {
    base = 96
  }
  return base
}

export const createHitRate = (factors: HitRateFactors) => {
  const { criticalRateConstant, hitRateBonus = 0, criticalRateBonus = 0 } = factors
  const hitRateBase = calcHitRateBase(factors)

  const hitPercent = Math.floor(hitRateBase + 1 + hitRateBonus * 100)
  const criticalPercent = Math.floor(Math.sqrt(hitRateBase) * criticalRateConstant + 1 + criticalRateBonus * 100)

  const hitRate = Math.min(hitPercent / 100, 1)
  const criticalRate = Math.min(criticalPercent / 100, 1)
  const normalHitRate = hitRate - criticalRate
  return { hitRate, criticalRate, normalHitRate }
}

export * from "./shelling"
export * from "./fighterPower"
export * from "./shipStat"

export * from "./attackPower"
export * from "./asw"

export * from "./EvasionValue"
