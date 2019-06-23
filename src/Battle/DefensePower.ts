import { random, range } from 'lodash-es'
import { IShip } from '../objects'

export default class DefensePower {
  constructor(private armor: number, private improvementModifier: number) {}

  private get baseArmor() {
    return this.armor + this.improvementModifier
  }

  get min() {
    const baseArmor = Math.max(this.baseArmor, 1)
    return baseArmor * 0.7
  }

  get max() {
    const { min, baseArmor } = this
    return min + Math.floor(baseArmor - 1) * 0.6
  }

  get values() {
    const { min, baseArmor } = this
    return range(Math.floor(baseArmor)).map(value => min + value)
  }

  public random = () => {
    const { min, baseArmor } = this
    return min + random(Math.floor(baseArmor - 1)) * 0.6
  }
}
