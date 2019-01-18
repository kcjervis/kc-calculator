import { EquipmentCategoryId, MasterEquipment } from '../../data'

export interface IImprovement {
  /** 改修値 */
  value: number

  fighterPowerModifier: number
  adjustedAntiAirModifier: number
  fleetAntiAirModifier: number

  shellingPowerModifier: number
  shellingAccuracyModifier: number

  effectiveLosModifier: number
}

export default class Improvement implements IImprovement {
  public value: number
  constructor(value: number | undefined, private readonly master: MasterEquipment) {
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

  get shellingPowerModifier() {
    const { firepower, category } = this.master

    if (
      category.is('Torpedo') ||
      category.is('MidgetSubmarine') ||
      category.isRadar ||
      category.isArmor ||
      category.is('EngineImprovement')
    ) {
      return 0
    }

    let multiplier = 1

    if (firepower > 12) {
      multiplier = 1.5
    } else if (category.is('Sonar') || category.is('LargeSonar') || category.is('DepthCharge')) {
      multiplier = 0.75
    }

    return multiplier * Math.sqrt(this.value)
  }

  get shellingAccuracyModifier() {
    const { accuracy, category } = this.master

    if (category.is('Torpedo')) {
      return 0
    }

    const isLargeRadar = category.is('LargeRadar') || category.is('LargeRadar2')
    const isSurfaceRadar = category.isRadar && accuracy > 2

    let multiplier = 0
    if (isLargeRadar || isSurfaceRadar) {
      multiplier = 1.7
    } else if (
      category.is('Sonar') ||
      category.is('LargeSonar') ||
      category.is('DepthCharge') ||
      category.isArmor ||
      category.is('AntiAircraftGun')
    ) {
      multiplier = 1
    } else {
      return 0
    }

    return multiplier * Math.floor(this.value)
  }

  get effectiveLosModifier() {
    let multiplier = 0
    const { category } = this.master
    if (category.is('SmallRadar')) {
      multiplier = 1.25
    } else if (category.either('LargeRadar', 'LargeRadar2')) {
      multiplier = 1.4
    } else if (
      category.either(
        'CarrierBasedReconnaissanceAircraft',
        'CarrierBasedReconnaissanceAircraft2',
        'ReconnaissanceSeaplane'
      )
    ) {
      multiplier = 1.2
    } else if (category.is('SeaplaneBomber')) {
      multiplier = 1.15
    }
    return multiplier * Math.sqrt(this.value)
  }
}
