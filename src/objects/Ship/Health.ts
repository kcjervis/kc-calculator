/**
 * Less 無傷
 * Shouha 小破
 * Chuuha 中破
 * Taiha 大破
 * Sunk 轟沈
 */
export type HealthDamage = "Less" | "Shouha" | "Chuuha" | "Taiha" | "Sunk"

export interface IHealth {
  maxHp: number
  currentHp: number

  damage: HealthDamage
  gte: (damage: HealthDamage) => boolean
  lte: (damage: HealthDamage) => boolean
  shellingPowerModifier: number
  torpedoPowerModifier: number
  aswPowerModifier: number
  nightAttackPowerModifier: number
}

export default class Health implements IHealth {
  constructor(public readonly maxHp: number, public currentHp: number) {}

  get damage() {
    const rate = this.currentHp / this.maxHp
    if (rate <= 0) {
      return "Sunk"
    } else if (rate <= 0.25) {
      return "Taiha"
    } else if (rate <= 0.5) {
      return "Chuuha"
    } else if (rate <= 0.75) {
      return "Shouha"
    }
    return "Less"
  }

  public gte = (damage: HealthDamage) => {
    const rate = this.currentHp / this.maxHp
    switch (damage) {
      case "Less":
        return rate >= 1
      case "Shouha":
        return rate >= 0.75
      case "Chuuha":
        return rate >= 0.5
      case "Taiha":
        return rate >= 0.25
    }
    return true
  }

  public lte = (damage: HealthDamage) => damage === this.damage || !this.gte(damage)

  get shellingPowerModifier() {
    switch (this.damage) {
      case "Less":
      case "Shouha":
        return 1
      case "Chuuha":
        return 0.7
      case "Taiha":
        return 0.4
    }
    return 0
  }

  get torpedoPowerModifier() {
    switch (this.damage) {
      case "Less":
      case "Shouha":
        return 1
      case "Chuuha":
        return 0.8
    }
    return 0
  }

  get aswPowerModifier() {
    return this.shellingPowerModifier
  }

  get nightAttackPowerModifier() {
    if (this.lte("Taiha")) {
      return 0
    }
    return this.shellingPowerModifier
  }
}
