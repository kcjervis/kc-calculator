import { IShip } from "./ship"
import { sumBy } from "lodash-es"
import { isNonNullable } from "../../utils"
import { InstallationType } from "../../types"
import { GearId } from "@jervis/data"

export default class ShipAntiInstallationStatus {
  constructor(private ship: IShip) {}

  private get shipType() {
    return this.ship.shipType
  }

  private get gears() {
    return this.ship.gears.filter(isNonNullable)
  }

  private get hasGear() {
    return this.ship.hasGear
  }

  private get countGear() {
    return this.ship.countGear
  }

  private get wgCount() {
    return this.countGear(GearId["WG42 (Wurfgerät 42)"])
  }

  // WG42加算補正 共通
  get wgAdditive() {
    const count = this.wgCount
    if (count === 1) {
      return 75
    }
    if (count === 2) {
      return 110
    }
    if (count === 3) {
      return 140
    }
    if (count >= 4) {
      return 160
    }
    return 0
  }

  get type4AntiGroundRocketLauncherAdditiv() {
    const count = this.countGear(GearId["艦載型 四式20cm対地噴進砲"])
    if (count === 1) {
      return 55
    }
    if (count === 2) {
      return 115
    }
    if (count === 3) {
      return 160
    }
    if (count >= 4) {
      return 190
    }
    return 0
  }

  get type4AntiGroundRocketLauncherConcentratedAdditiv() {
    const count = this.countGear(GearId["四式20cm対地噴進砲 集中配備"])
    if (count === 1) {
      return 80
    }
    if (count >= 2) {
      return 170
    }
    return 0
  }

  get antiGroundRocketLauncherModifiers() {
    const count =
      this.countGear(GearId["艦載型 四式20cm対地噴進砲"]) + this.countGear(GearId["四式20cm対地噴進砲 集中配備"])

    const b13d = this.type4AntiGroundRocketLauncherAdditiv + this.type4AntiGroundRocketLauncherConcentratedAdditiv

    if (count === 1) {
      return {
        b13d,
        antiPillbox: 1.5,
        antiIsolatedIsland: 1.3,
        antiSoftSkinned: 1.25,
        antiSupplyDepotPostCap: 1.2
      }
    }
    if (count >= 2) {
      return {
        b13d,

        antiPillbox: 2.7,
        antiIsolatedIsland: 2.145,
        antiSoftSkinned: 1.875,
        antiSupplyDepotPostCap: 1.68
      }
    }
    return {
      b13d,

      antiPillbox: 1,
      antiIsolatedIsland: 1,
      antiSoftSkinned: 1,
      antiSupplyDepotPostCap: 1
    }
  }

  get type2MortarCount() {
    return this.countGear(GearId["二式12cm迫撃砲改"])
  }

  get type2MortarConcentratedCount() {
    return this.countGear(GearId["二式12cm迫撃砲改 集中配備"])
  }

  get type2MortarAdditiv() {
    const count = this.type2MortarCount
    if (count === 1) {
      return 30
    }
    if (count === 2) {
      return 55
    }
    if (count === 3) {
      return 75
    }
    if (count >= 4) {
      return 90
    }
    return 0
  }

  get type2MortarConcentratedAdditiv() {
    const count = this.type2MortarConcentratedCount
    if (count === 1) {
      return 60
    }
    if (count === 2) {
      return 110
    }
    if (count >= 3) {
      return 150
    }
    return 0
  }

  get mortarModifiers() {
    const count = this.type2MortarCount + this.type2MortarConcentratedCount
    const b13d = this.type2MortarAdditiv + this.type2MortarConcentratedAdditiv
    if (count === 1) {
      return {
        b13d,
        antiPillbox: 1.3,
        antiIsolatedIsland: 1.2,
        antiSoftSkinned: 1.2,
        antiSupplyDepotPostCap: 1.15
      }
    }
    if (count >= 2) {
      return {
        b13d,
        antiPillbox: 1.95,
        antiIsolatedIsland: 1.68,
        antiSoftSkinned: 1.56,
        antiSupplyDepotPostCap: 1.38
      }
    }
    return {
      b13d,
      antiPillbox: 1,
      antiIsolatedIsland: 1,
      antiSoftSkinned: 1,
      antiSupplyDepotPostCap: 1
    }
  }

  // 大発改修補正 共通
  get landingCraftsImprovementMultiplicative() {
    const landingCrafts = this.gears.filter(gear => gear.is("LandingCraft"))
    if (landingCrafts.length === 0) {
      return 1
    }

    const average = sumBy(landingCrafts, gear => gear.improvement.value) / landingCrafts.length
    return 1 + average / 50
  }

  // 内火艇改修補正 共通
  get specialAmphibiousTanksImprovementMultiplicative() {
    const tanks = this.gears.filter(gear => gear.is("SpecialAmphibiousTank"))
    if (tanks.length === 0) {
      return 1
    }
    const average = sumBy(tanks, gear => gear.improvement.value) / tanks.length
    return 1 + average / 30
  }

  // 特大発 共通
  get tokuDaihatsuMultiplicative() {
    if (this.hasGear(GearId["特大発動艇"])) {
      return 1.15
    }
    return 1
  }

  // 特大発動艇＋戦車第11連隊 共通
  get shikonModifiers() {
    const shikonCount = this.countGear(GearId["特大発動艇+戦車第11連隊"])
    if (shikonCount >= 1) {
      return { b13: 25, a13: 1.8 }
    }
    return { b13: 0, a13: 1 }
  }

  get m4a1Modifiers() {
    const count = this.countGear(GearId["M4A1 DD"])
    if (count >= 1) {
      return { a13d: 1.4, b13: 25 }
    }
    return { a13d: 1, b13: 0 }
  }

  get submarineClassAdditive() {
    if (this.shipType.isSubmarineClass) {
      return 30
    }
    return 0
  }

  // 共通補正
  get commonModifiers() {
    const {
      wgAdditive,
      antiGroundRocketLauncherModifiers,
      mortarModifiers,

      landingCraftsImprovementMultiplicative,
      specialAmphibiousTanksImprovementMultiplicative,
      shikonModifiers,
      m4a1Modifiers,
      tokuDaihatsuMultiplicative,
      submarineClassAdditive
    } = this

    const shipTypeAdditive = submarineClassAdditive
    const a13 =
      landingCraftsImprovementMultiplicative *
      specialAmphibiousTanksImprovementMultiplicative *
      tokuDaihatsuMultiplicative *
      shikonModifiers.a13

    const b13 = shikonModifiers.b13 + m4a1Modifiers.b13

    const a13d = m4a1Modifiers.a13d
    const b13d = wgAdditive + antiGroundRocketLauncherModifiers.b13d + mortarModifiers.b13d

    return { shipTypeAdditive, a13, b13, a13d, b13d }
  }

  get antiSoftSkinnedModifiers() {
    const { wgCount, commonModifiers, hasGear, countGear } = this
    let { a13 } = commonModifiers

    if (hasGear("AntiAircraftShell")) {
      a13 *= 2.5
    }

    if (wgCount >= 1) {
      a13 *= 1.3
    }
    if (wgCount >= 2) {
      a13 *= 1.4
    }

    a13 *= this.antiGroundRocketLauncherModifiers.antiSoftSkinned
    a13 *= this.mortarModifiers.antiSoftSkinned

    if (hasGear("SeaplaneBomber") || hasGear("SeaplaneFighter")) {
      a13 *= 1.2
    }

    if (hasGear("LandingCraft")) {
      a13 *= 1.4
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(GearId["大発動艇(八九式中戦車&陸戦隊)"])
    if (count166 >= 1) {
      a13 *= 1.5
    }
    if (count166 >= 2) {
      a13 *= 1.3
    }

    // 内火艇
    const countSpecialAmphibiousTank = countGear("SpecialAmphibiousTank")
    if (countSpecialAmphibiousTank >= 1) {
      a13 *= 1.5
    }
    if (countSpecialAmphibiousTank >= 2) {
      a13 *= 1.2
    }

    return { ...commonModifiers, a13 }
  }

  get antiPillboxModifiers() {
    const { shipType, wgCount, commonModifiers, hasGear, countGear } = this

    let { a13 } = commonModifiers

    if (hasGear("ArmorPiercingShell")) {
      a13 *= 1.85
    }

    if (wgCount >= 1) {
      a13 *= 1.6
    }
    if (wgCount >= 2) {
      a13 *= 1.7
    }

    a13 *= this.antiGroundRocketLauncherModifiers.antiPillbox
    a13 *= this.mortarModifiers.antiPillbox

    if (hasGear("SeaplaneBomber") || hasGear("SeaplaneFighter") || hasGear("CarrierBasedDiveBomber")) {
      a13 *= 1.5
    }

    if (hasGear("LandingCraft")) {
      a13 *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      a13 *= 1.5
    }
    if (count166 >= 2) {
      a13 *= 1.4
    }

    // 内火艇
    const countSpecialAmphibiousTank = countGear("SpecialAmphibiousTank")
    if (countSpecialAmphibiousTank >= 1) {
      a13 *= 2.4
    }
    if (countSpecialAmphibiousTank >= 2) {
      a13 *= 1.35
    }

    if (shipType.isDestroyer || shipType.isLightCruiserClass) {
      a13 *= 1.4
    }

    return { ...commonModifiers, a13 }
  }

  get antiIsolatedIslandModifiers() {
    const { wgCount, commonModifiers, hasGear, countGear } = this

    let { a13 } = commonModifiers

    if (hasGear("AntiAircraftShell")) {
      a13 *= 1.75
    }

    if (wgCount >= 1) {
      a13 *= 1.4
    }
    if (wgCount >= 2) {
      a13 *= 1.5
    }

    a13 *= this.antiGroundRocketLauncherModifiers.antiIsolatedIsland
    a13 *= this.mortarModifiers.antiIsolatedIsland

    if (hasGear("CarrierBasedDiveBomber")) {
      a13 *= 1.4
    }

    if (hasGear("LandingCraft")) {
      a13 *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      a13 *= 1.2
    }
    if (count166 >= 2) {
      a13 *= 1.4
    }

    // 内火艇
    const specialAmphibiousTankCount = countGear("SpecialAmphibiousTank")
    if (specialAmphibiousTankCount >= 1) {
      a13 *= 2.4
    }
    if (specialAmphibiousTankCount >= 2) {
      a13 *= 1.35
    }

    return { ...commonModifiers, a13 }
  }

  get antiSupplyDepotPostCapModifier() {
    const {
      wgCount,
      landingCraftsImprovementMultiplicative,
      specialAmphibiousTanksImprovementMultiplicative,
      hasGear,
      countGear
    } = this
    let postCapMultiplicative = 1

    if (wgCount >= 1) {
      postCapMultiplicative *= 1.25
    }
    if (wgCount >= 2) {
      postCapMultiplicative *= 1.3
    }

    postCapMultiplicative *= this.antiGroundRocketLauncherModifiers.antiSupplyDepotPostCap
    postCapMultiplicative *= this.mortarModifiers.antiSupplyDepotPostCap

    if (hasGear("LandingCraft")) {
      postCapMultiplicative *= 1.7
    }

    // 特大発
    if (countGear(GearId["特大発動艇"]) >= 1) {
      postCapMultiplicative *= 1.2
    }

    postCapMultiplicative *= landingCraftsImprovementMultiplicative

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(GearId["大発動艇(八九式中戦車&陸戦隊)"])
    if (count166 >= 1) {
      postCapMultiplicative *= 1.3 * landingCraftsImprovementMultiplicative
    }
    if (count166 >= 2) {
      postCapMultiplicative *= 1.6
    }

    const countSpecialAmphibiousTank = countGear("SpecialAmphibiousTank")
    if (countSpecialAmphibiousTank >= 1) {
      postCapMultiplicative *= 1.7
    }
    if (countSpecialAmphibiousTank >= 2) {
      postCapMultiplicative *= 1.5
    }
    postCapMultiplicative *= specialAmphibiousTanksImprovementMultiplicative

    return postCapMultiplicative
  }

  public getModifiersFromType = (type: InstallationType) => {
    const modifiers = { shipTypeAdditive: 0, a13: 1, b13: 0, a13d: 1, b13d: 0, postCapMultiplicative: 1 }
    switch (type) {
      case "SoftSkinned":
        return { ...modifiers, ...this.antiSoftSkinnedModifiers }
      case "Pillbox":
        return { ...modifiers, ...this.antiPillboxModifiers }
      case "IsolatedIsland":
        return { ...modifiers, ...this.antiIsolatedIslandModifiers }
      case "SupplyDepot":
        return {
          ...modifiers,
          ...this.antiSoftSkinnedModifiers,
          postCapMultiplicative: this.antiSupplyDepotPostCapModifier
        }
    }

    return modifiers
  }
}
