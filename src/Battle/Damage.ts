import DefensePower from './DefensePower'

export default class Damage {
  public static calc = (attackPower = 0, baseArmor = 0, remainingAmmoModifier = 1) => {
    return new Damage(attackPower, baseArmor, remainingAmmoModifier).random()
  }

  constructor(
    private readonly attackPower = 0,
    private readonly baseArmor = 0,
    private readonly remainingAmmoModifier = 1
  ) {}

  private get defensePower() {
    return new DefensePower(this.baseArmor)
  }

  private calcValue = (defensePowerValue: number) => {
    const { attackPower, remainingAmmoModifier } = this
    return Math.floor((attackPower - defensePowerValue) * remainingAmmoModifier)
  }

  public get min() {
    return this.calcValue(this.defensePower.max)
  }

  public get max() {
    return this.calcValue(this.defensePower.min)
  }

  public random = () => {
    return this.calcValue(this.defensePower.random())
  }
}
