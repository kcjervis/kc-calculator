export interface IHealth {
  maxHp: number
  nowHp: number

  damage: 'Less' | 'Minor' | 'Moderate' | 'Heavy'
  shellingPowerModifier: number
  torpedoPowerModifire: number
}

export default class Health implements IHealth {
  constructor(public readonly maxHp: number, public nowHp: number) {}

  get damage() {
    const rate = this.nowHp / this.maxHp
    if (rate <= 0.25) {
      return 'Heavy'
    } else if (rate <= 0.5) {
      return 'Moderate'
    } else if (rate <= 0.75) {
      return 'Minor'
    }
    return 'Less'
  }

  get shellingPowerModifier() {
    switch (this.damage) {
      case 'Heavy':
        return 0.4
      case 'Minor':
        return 0.7
      default:
        return 1
    }
  }

  get torpedoPowerModifire() {
    switch (this.damage) {
      case 'Heavy':
        return 0
      case 'Minor':
        return 0.8
      default:
        return 1
    }
  }
}
