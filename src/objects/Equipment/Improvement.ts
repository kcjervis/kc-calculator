import { EquipmentCategoryId, MasterEquipment } from '../../data'

export interface IImprovement {
  /** 改修値 */
  value: number

  contactSelectionModifier: number

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

  /**
   * https://t.co/Ou8KzFANPK
   * https://twitter.com/shiro_sh39/status/1103281372548878337
   *
   */
  get contactSelectionModifier() {
    const { value, master } = this
    const { los, category } = master
    if (!category.isReconnaissanceAircraft) {
      return 0
    }
    if (category.either('CarrierBasedReconnaissanceAircraft', 'CarrierBasedReconnaissanceAircraft2')) {
      if (los === 8) {
        // 二式艦偵 [0.25, 3) または√☆
        return 0.25 * value
      }
      if (los === 11) {
        // 景雲 (0.333..., 0.4]
        return 0.4 * value
      }
    } else {
      if (los === 6) {
        // 零観 (0.166..., 0.2]
        return 0.2 * value
      }
      if (los >= 4) {
        // 零偵 Ro.43 (0.125, 0.1428...]
        return 0.14 * value
      }
      if (los === 3) {
        // 夜偵 (0, 0.1]
        return 0.1 * value
      }
    }

    return 0
  }

  get fighterPowerModifier() {
    const { value, master } = this
    const { category } = master
    if (category.isFighter) {
      return 0.2 * value
    } else if (category.is('CarrierBasedDiveBomber')) {
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
    const { firepower, category, id: masterId } = this.master

    const isDepthCharge = [226, 227].includes(masterId)

    if (
      isDepthCharge ||
      category.isRadar ||
      category.isArmor ||
      category.isAircraft ||
      category.either('Torpedo', 'MidgetSubmarine', 'EngineImprovement', 'CombatRation')
    ) {
      return 0
    }

    if ([10, 66, 220, 275].includes(masterId)) {
      return 0.2 * this.value
    }
    if ([12, 234, 247].includes(masterId)) {
      return 0.3 * this.value
    }

    let multiplier = 1

    if (firepower > 12) {
      multiplier = 1.5
    } else if (category.either('Sonar', 'LargeSonar', 'DepthCharge')) {
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
