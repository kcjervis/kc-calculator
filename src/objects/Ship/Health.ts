/**
 * Less 無傷
 * Minor 小破
 * Moderate 中破
 * Heavy 大破
 * Lost 轟沈
 */
type HealthDamage = "Less" | "Minor" | "Moderate" | "Heavy" | "Lost"

export interface IHealth {
  maxHp: number
  nowHp: number

  damage: HealthDamage
  gte: (damage: HealthDamage) => boolean
  lte: (damage: HealthDamage) => boolean
  shellingPowerModifier: number
  torpedoPowerModifire: number
  nightAttackPowerModifire: number
}

export default class Health implements IHealth {
  constructor(public readonly maxHp: number, public nowHp: number) {}

  get damage() {
    const rate = this.nowHp / this.maxHp
    if (rate <= 0) {
      return "Lost"
    } else if (rate <= 0.25) {
      return "Heavy"
    } else if (rate <= 0.5) {
      return "Moderate"
    } else if (rate <= 0.75) {
      return "Minor"
    }
    return "Less"
  }

  public gte = (damage: HealthDamage) => {
    const rate = this.nowHp / this.maxHp
    switch (damage) {
      case "Less":
        return rate >= 1
      case "Minor":
        return rate >= 0.75
      case "Moderate":
        return rate >= 0.5
      case "Heavy":
        return rate >= 0.25
    }
    return true
  }

  public lte = (damage: HealthDamage) => damage === this.damage || !this.gte(damage)

  get shellingPowerModifier() {
    switch (this.damage) {
      case "Less":
      case "Minor":
        return 1
      case "Moderate":
        return 0.7
      case "Heavy":
        return 0.4
    }
    return 0
  }

  get torpedoPowerModifire() {
    switch (this.damage) {
      case "Less":
      case "Minor":
        return 1
      case "Moderate":
        return 0.8
    }
    return 0
  }

  get nightAttackPowerModifire() {
    if (this.lte("Heavy")) {
      return 0
    }
    return this.shellingPowerModifier
  }
}
