export type HitRateFactors = {
  accuracy: number
  evasion: number
  moraleModifier: number

  criticalRateMultiplier: number
  hitRateBonus?: number
  criticalRateBonus?: number
}

/**
 * @returns 10~96
 */
export const calcHitRateBasis = ({ accuracy, evasion, moraleModifier }: HitRateFactors) => {
  const value = (accuracy - evasion) * moraleModifier

  if (value < 10) {
    return 10
  }

  if (value > 96) {
    return 96
  }

  return value
}

type HitRate = {
  total: number
  criticalRate: number
  normalRate: number
}

export const createHitRate = (factors: HitRateFactors): HitRate => {
  const { criticalRateMultiplier, hitRateBonus = 0, criticalRateBonus = 0 } = factors
  const hitRateBasis = calcHitRateBasis(factors)

  const hitPercent = Math.floor(hitRateBasis + 1 + hitRateBonus * 100)
  const criticalPercent = Math.floor(Math.sqrt(hitRateBasis) * criticalRateMultiplier + 1 + criticalRateBonus * 100)

  const total = Math.min(hitPercent / 100, 1)
  const criticalRate = Math.min(criticalPercent / 100, 1)
  const normalRate = total - criticalRate

  return { total, criticalRate, normalRate }
}

type HitStatus = "Miss" | "Normal" | "Critical"

export const getHitStatus = (rate: HitRate): HitStatus => {
  const randomNum = Math.random()

  if (randomNum < rate.criticalRate) {
    return "Critical"
  }

  if (randomNum < rate.total) {
    return "Normal"
  }

  return "Miss"
}
