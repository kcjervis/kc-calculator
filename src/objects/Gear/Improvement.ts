import { MasterGear } from "../../data"

export type ImprovementModifiers = {
  contactSelectionModifier: number

  fighterPowerModifier: number
  adjustedAntiAirModifier: number
  fleetAntiAirModifier: number

  shellingPowerModifier: number
  shellingAccuracyModifier: number

  effectiveLosModifier: number
  defensePowerModifier: number
}

export interface IImprovement extends ImprovementModifiers {
  /** 改修値 */
  value: number
}

export default class Improvement implements IImprovement {
  constructor(public value = 0, private readonly master: MasterGear) {}

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
    if (category.any("CarrierBasedReconnaissanceAircraft", "CarrierBasedReconnaissanceAircraft2")) {
      if (los === 7) {
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
    } else if (category.is("CarrierBasedDiveBomber")) {
      return 0.25 * value
    }
    return 0
  }

  get adjustedAntiAirModifier() {
    const { antiAir, category, hasAttr } = this.master
    if (antiAir === 0) {
      return 0
    }

    let multiplier = 0
    if (category.is("AntiAircraftGun")) {
      // https://twitter.com/CitrusJ9N/status/1056224720712921088
      multiplier = antiAir <= 7 ? 4 : 6
    } else if (category.is("AntiAircraftFireDirector") || hasAttr("HighAngleMount")) {
      multiplier = antiAir <= 7 ? 2 : 3
    }
    return multiplier * Math.sqrt(this.value)
  }

  get fleetAntiAirModifier() {
    const { antiAir, category, hasAttr } = this.master
    if (antiAir === 0) {
      return 0
    }
    // 装備定数B
    let multiplier = 0
    if (category.is("AntiAircraftFireDirector") || hasAttr("HighAngleMount")) {
      multiplier = antiAir <= 7 ? 2 : 3
    } else if (hasAttr("Radar") && antiAir >= 2) {
      multiplier = 1.5
    }
    return multiplier * Math.sqrt(this.value)
  }

  get shellingPowerModifier() {
    const { firepower, category, id: masterId, hasAttr } = this.master

    const isDepthCharge = [226, 227].includes(masterId)

    if (category.is("CarrierBasedTorpedoBomber")) {
      return 0.2 * this.value
    }

    if (
      isDepthCharge ||
      hasAttr("Radar") ||
      hasAttr("Armor") ||
      category.isAircraft ||
      category.any("Torpedo", "MidgetSubmarine", "EngineImprovement", "CombatRation")
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
    } else if (category.any("Sonar", "LargeSonar", "DepthCharge")) {
      multiplier = 0.75
    }

    return multiplier * Math.sqrt(this.value)
  }

  get shellingAccuracyModifier() {
    const { category, hasAttr } = this.master

    if (category.is("Torpedo")) {
      return 0
    }

    const isLargeRadar = category.any("LargeRadar", "LargeRadar2")

    if (isLargeRadar || hasAttr("SurfaceRadar")) {
      return 1.7 * Math.sqrt(this.value)
    } else if (
      hasAttr("Radar") ||
      hasAttr("MainGun") ||
      hasAttr("Armor") ||
      category.any(
        "SecondaryGun",
        "Sonar",
        "LargeSonar",
        "DepthCharge",
        "ArmorPiercingShell",
        "AntiAircraftFireDirector"
      )
    ) {
      return Math.sqrt(this.value)
    }

    return 0
  }

  get effectiveLosModifier() {
    let multiplier = 0
    const { category } = this.master
    if (category.is("SmallRadar")) {
      multiplier = 1.25
    } else if (category.any("LargeRadar", "LargeRadar2")) {
      multiplier = 1.4
    } else if (
      category.any(
        "CarrierBasedReconnaissanceAircraft",
        "CarrierBasedReconnaissanceAircraft2",
        "ReconnaissanceSeaplane"
      )
    ) {
      multiplier = 1.2
    } else if (category.is("SeaplaneBomber")) {
      multiplier = 1.15
    }
    return multiplier * Math.sqrt(this.value)
  }

  get defensePowerModifier() {
    const { category } = this.master
    if (category.is("MediumExtraArmor")) {
      return 0.2 * this.value
    }
    if (category.is("LargeExtraArmor")) {
      return 0.3 * this.value
    }
    return 0
  }
}
