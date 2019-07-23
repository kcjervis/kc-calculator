import DefensePower from './DefensePower'

export default class Damage {
  public static calc = (attackPower = 0, baseArmor: DefensePower, remainingAmmoModifier = 1) => {
    return new Damage(attackPower, baseArmor, remainingAmmoModifier).random()
  }

  constructor(
    private readonly attackPower = 0,
    private readonly defensePower: DefensePower,
    private readonly defenderNowHp: number,
    private readonly remainingAmmoModifier = 1
  ) {}

  private calcValue = (defensePowerValue: number) => {
    const { attackPower, remainingAmmoModifier } = this
    const value = Math.floor((attackPower - defensePowerValue) * remainingAmmoModifier)
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
    return defensePower.values.map(calcValue)
  }

  public get isDeadly() {
    const { min, defenderNowHp } = this
    return defenderNowHp <= min
  }

  public get scratchDamageProbability() {
    const { values } = this
    return values.filter(value => value <= 0).length / values.length
  }
}