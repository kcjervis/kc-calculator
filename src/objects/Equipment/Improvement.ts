import { EquipmentCategoryId, EquipmentMaster } from '../../data'

export interface IImprovement {
  /** 改修値 */
  value: number

  fighterPowerModifier: number
  adjustedAntiAirModifier: number
  fleetAntiAirModifier: number
}

export default class Improvement implements IImprovement {
  public value: number
  constructor(value: number | undefined, private readonly master: EquipmentMaster) {
    this.value = value ? value : 0
  }

  get fighterPowerModifier() {
    const { value, master } = this
    if (master.category.isFighter) {
      return 0.2 * value
    } else if (master.category.id === EquipmentCategoryId.SeaplaneBomber) {
      return 0.25 * value
    }
    return 0
  }

  get adjustedAntiAirModifier() {
    const { antiAir, category, isHighAngleMount } = this.master
    if (antiAir === 0) {
      return 0
    }

    let multiplier = 0
    if (category.id === EquipmentCategoryId.AntiAircraftGun) {
      // https://twitter.com/CitrusJ9N/status/1056224720712921088
      multiplier = antiAir <= 7 ? 4 : 6
    } else if (category.id === EquipmentCategoryId.AntiAircraftFireDirector || isHighAngleMount) {
      multiplier = antiAir <= 7 ? 2 : 3
    }
    return multiplier * Math.sqrt(this.value)
  }

  get fleetAntiAirModifier() {
    const { antiAir, category, isHighAngleMount } = this.master
    if (antiAir === 0) {
      return 0
    }
    // 装備定数B
    let multiplier = 0
    if (category.id === EquipmentCategoryId.AntiAircraftFireDirector || isHighAngleMount) {
      multiplier = antiAir <= 7 ? 2 : 3
    } else if (category.isRadar && antiAir >= 2) {
      multiplier = 1.5
    }
    return multiplier * Math.sqrt(this.value)
  }
}
