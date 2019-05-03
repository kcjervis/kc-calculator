import { random } from 'lodash-es'

export default class DefensePower {
  constructor(public baseArmor = 0) {}

  get min() {
    const baseArmor = Math.max(this.baseArmor, 1)
    return baseArmor * 0.7
  }

  get max() {
    const { min, baseArmor } = this
    return min + Math.floor(baseArmor - 1) * 0.6
  }

  public random = () => {
    const { min, baseArmor } = this
    return min + random(Math.floor(baseArmor - 1)) * 0.6
  }

  public valueOf = this.random
}
