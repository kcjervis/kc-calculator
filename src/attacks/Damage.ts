import { range } from "lodash-es"
import { DefensePower } from "../types"
export default class Damage {
  public static calc = (attackPower = 0, baseArmor: DefensePower, remainingAmmoModifier = 1) => {
    return new Damage(attackPower, baseArmor, remainingAmmoModifier).random()
  }

  constructor(
    private readonly attackPower = 0,
    private readonly defensePower: DefensePower,
    private readonly defenderCurrentHp: number,
    private readonly remainingAmmoModifier = 1,
    private readonly armorPenetration = 0
  ) {}

  private calcValue = (defensePowerValue: number) => {
    const { attackPower, remainingAmmoModifier, armorPenetration } = this
    const effectiveDefensePower = Math.max(1, defensePowerValue - armorPenetration)
    const value = Math.floor((attackPower - effectiveDefensePower) * remainingAmmoModifier)
    return Math.max(0, value)
  }

  public random = () => {
    return this.calcValue(this.defensePower.random())
  }

  public get min() {
    return this.calcValue(this.defensePower.max)
  }

  public get max() {
    return this.calcValue(this.defensePower.min)
  }

  public get values() {
    const { defensePower, calcValue } = this
    return defensePower.values().map(calcValue)
  }

  public get isDeadly() {
    const { min, defenderCurrentHp } = this
    return defenderCurrentHp <= min
  }

  public get scratchDamageProbability() {
    const { values } = this
    return values.filter(value => value <= 0).length / values.length
  }

  public get scratchDamages() {
    const { defenderCurrentHp } = this
    return range(defenderCurrentHp).map(randomValue => Math.floor(defenderCurrentHp * 0.06 + randomValue * 0.08))
  }

  public get deadlyDamageProbability() {
    const { values, defenderCurrentHp } = this
    return values.filter(value => defenderCurrentHp - value <= 0).length / values.length
  }

  public get stopperDamages() {
    const { defenderCurrentHp } = this
    return range(defenderCurrentHp).map(randomValue => Math.floor(defenderCurrentHp * 0.5 + randomValue * 0.3))
  }
}
