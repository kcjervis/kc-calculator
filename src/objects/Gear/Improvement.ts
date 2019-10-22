import { GearStats } from "../../types"
import { GearAttribute } from "../../data"
import { GearId } from "@jervis/data"

export type ImprovementModifiers = {
  contactSelectionModifier: number

  fighterPowerModifier: number
  adjustedAntiAirModifier: number
  fleetAntiAirModifier: number

  shellingPowerModifier: number
  shellingAccuracyModifier: number

  nightAttackPowerModifier: number
  nightAttackAccuracyModifier: number

  effectiveLosModifier: number
  defensePowerModifier: number
}

export interface IImprovement extends ImprovementModifiers {
  /** 改修値 */
  value: number
}

export default class Improvement implements IImprovement {
  constructor(public value = 0, private stats: GearStats, private gearIs: (attr: GearAttribute) => boolean) {}

  /**
   * https://t.co/Ou8KzFANPK
   * https://twitter.com/shiro_sh39/status/1103281372548878337
   *
   */
  get contactSelectionModifier() {
    const { value, gearIs } = this
    if (!gearIs("ReconnaissanceAircraft")) {
      return 0
    }
    const { los } = this.stats

    if (gearIs("CarrierBasedReconnaissanceAircraft") || gearIs("CarrierBasedReconnaissanceAircraft2")) {
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
    const { value, gearIs } = this
    if (gearIs("Fighter")) {
      return 0.2 * value
    } else if (gearIs("CarrierBasedDiveBomber")) {
      return 0.25 * value
    }
    return 0
  }

  get adjustedAntiAirModifier() {
    const { gearIs } = this
    const { antiAir } = this.stats
    if (antiAir === 0) {
      return 0
    }

    let multiplier = 0
    if (gearIs("AntiAircraftGun")) {
      // https://twitter.com/CitrusJ9N/status/1056224720712921088
      multiplier = antiAir <= 7 ? 4 : 6
    } else if (gearIs("AntiAircraftFireDirector") || gearIs("HighAngleMount")) {
      multiplier = antiAir <= 7 ? 2 : 3
    }
    return multiplier * Math.sqrt(this.value)
  }

  get fleetAntiAirModifier() {
    const { gearIs } = this
    const { antiAir } = this.stats

    if (antiAir === 0) {
      return 0
    }
    // 装備定数B
    let multiplier = 0
    if (gearIs("AntiAircraftFireDirector") || gearIs("HighAngleMount")) {
      multiplier = antiAir <= 7 ? 2 : 3
    } else if (gearIs("AirRadar")) {
      multiplier = 1.5
    }
    return multiplier * Math.sqrt(this.value)
  }

  get shellingPowerModifier() {
    const { firepower, gearId } = this.stats
    const { gearIs } = this

    if (firepower > 12) {
      return 1.5 * Math.sqrt(this.value)
    }

    if (gearIs("CarrierBasedTorpedoBomber")) {
      return 0.2 * this.value
    }

    if (
      [
        GearId["12.7cm連装高角砲"],
        GearId["8cm高角砲"],
        GearId["8cm高角砲改+増設機銃"],
        GearId["10cm連装高角砲改+増設機銃"]
      ].includes(gearId)
    ) {
      return 0.2 * this.value
    }

    if ([GearId["15.5cm三連装副砲"], GearId["15.5cm三連装副砲改"], GearId["15.2cm三連装砲"]].includes(gearId)) {
      return 0.3 * this.value
    }

    if (
      gearIs("MainGun") ||
      gearIs("SecondaryGun") ||
      gearIs("ArmorPiercingShell") ||
      gearIs("AntiAircraftFireDirector") ||
      gearIs("Searchlight") ||
      gearIs("AntiAircraftGun") ||
      gearIs("LandingCraft") ||
      gearIs("SpecialAmphibiousTank") ||
      gearIs("AntiAircraftShell")
    ) {
      return Math.sqrt(this.value)
    }

    if (gearIs("Sonar") || gearIs("LargeRadar") || gearIs("DepthCharge")) {
      return 0.75 * Math.sqrt(this.value)
    }

    return 0
  }

  get shellingAccuracyModifier() {
    const { gearIs } = this

    if (gearIs("SurfaceRadar")) {
      return 1.7 * Math.sqrt(this.value)
    }

    if (
      gearIs("Radar") ||
      gearIs("MainGun") ||
      gearIs("SecondaryGun") ||
      gearIs("Sonar") ||
      gearIs("LargeSonar") ||
      gearIs("DepthCharge") ||
      gearIs("ArmorPiercingShell") ||
      gearIs("AntiAircraftFireDirector")
    ) {
      return Math.sqrt(this.value)
    }

    return 0
  }

  get nightAttackPowerModifier() {
    const { gearIs } = this
    const { gearId } = this.stats
    // 12.7cm 連装高角砲、8cm 高角砲、8cm 高角砲改＋増設機銃、10cm 連装高角砲改＋増設機銃
    if ([10, 66, 220, 275].includes(gearId)) {
      return 0.2 * this.value
    }
    // 15.5cm 三連装副砲、15.5cm 三連装副砲改、15.2cm 三連装砲
    if ([12, 234, 247].includes(gearId)) {
      return 0.3 * this.value
    }

    if (
      gearIs("MainGun") ||
      gearIs("SecondaryGun") ||
      gearIs("ArmorPiercingShell") ||
      gearIs("AntiAircraftShell") ||
      gearIs("AntiAircraftFireDirector") ||
      gearIs("Searchlight") ||
      gearIs("Torpedo") ||
      gearIs("LandingCraft") ||
      gearIs("SpecialAmphibiousTank") ||
      gearIs("MidgetSubmarine")
    ) {
      return Math.sqrt(this.value)
    }

    return 0
  }

  get nightAttackAccuracyModifier() {
    const { gearIs, value } = this

    if (gearIs("SurfaceRadar")) {
      return 1.6 * Math.sqrt(value)
    }

    if (gearIs("MediumCaliberMainGun") || gearIs("Radar")) {
      return 1.3 * Math.sqrt(value)
    }

    return 0
  }

  get effectiveLosModifier() {
    const { gearIs, value } = this
    if (gearIs("SmallRadar")) {
      return 1.25 * Math.sqrt(value)
    }

    if (gearIs("LargeRadar") || gearIs("LargeRadar2")) {
      return 1.4 * Math.sqrt(value)
    }

    if (
      gearIs("CarrierBasedReconnaissanceAircraft") ||
      gearIs("CarrierBasedReconnaissanceAircraft2") ||
      gearIs("ReconnaissanceSeaplane")
    ) {
      return 1.2 * Math.sqrt(value)
    }

    if (gearIs("SeaplaneBomber")) {
      return 1.15 * Math.sqrt(value)
    }

    return 0
  }

  get defensePowerModifier() {
    const { gearIs } = this
    if (gearIs("MediumExtraArmor")) {
      return 0.2 * this.value
    }
    if (gearIs("LargeExtraArmor")) {
      return 0.3 * this.value
    }
    return 0
  }
}
