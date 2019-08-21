import { IShip } from '../objects'
import { sumBy } from 'lodash-es'
import { nonNullable } from '../utils'
import { InstallationType } from '../types'

export default class ShipAntiInstallationStatus {
  constructor(private ship: IShip) {}

  private get gears() {
    return this.ship.gears.filter(nonNullable)
  }

  private get countGear() {
    return this.ship.countGear
  }

  private get countGearCategory() {
    return this.ship.countGearCategory
  }

  private get hasGearCategory() {
    return this.ship.hasGearCategory
  }

  private get wgCount() {
    return this.countGear(126)
  }

  get bombing() {
    const antiInstallationBombers = this.gears.filter(gear => gear.isAntiInstallationBomber)
    return sumBy(antiInstallationBombers, gear => gear.bombing)
  }

  // WG42加算補正 共通
  get wgAdditive() {
    const { wgCount } = this
    if (wgCount === 1) {
      return 75
    }
    if (wgCount === 2) {
      return 110
    }
    if (wgCount === 3) {
      return 140
    }
    if (wgCount >= 4) {
      return 160
    }
    return 0
  }

  // 大発改修補正 共通
  get landingCraftsImprovementMultiplicative() {
    const landingCrafts = this.gears.filter(gear => gear.category.is('LandingCraft'))
    if (landingCrafts.length === 0) {
      return 1
    }

    const average = sumBy(landingCrafts, gear => gear.improvement.value) / landingCrafts.length
    return 1 + average / 50
  }

  // 内火艇改修補正 共通
  get specialAmphibiousTanksImprovementMultiplicative() {
    const tanks = this.gears.filter(gear => gear.category.is('SpecialAmphibiousTank'))
    if (tanks.length === 0) {
      return 1
    }
    const average = sumBy(tanks, gear => gear.improvement.value) / tanks.length
    return 1 + average / 30
  }

  // 特大発 共通
  get tokuDaihatsuMultiplicative() {
    if (this.ship.hasGear(193)) {
      return 1.15
    }
    return 1
  }

  // 特大発動艇＋戦車第11連隊 共通
  get shikonModifiers() {
    const count230 = this.countGear(230)
    if (count230 >= 1) {
      return { additive: 25, multiplicative: 1.8 }
    }
    return { additive: 0, multiplicative: 1 }
  }

  get submarineClassAdditive() {
    if (this.ship.shipType.isSubmarineClass) {
      return 30
    }
    return 0
  }

  // 共通補正
  get commonModifiers() {
    const {
      wgAdditive,
      landingCraftsImprovementMultiplicative,
      specialAmphibiousTanksImprovementMultiplicative,
      shikonModifiers,
      tokuDaihatsuMultiplicative,
      submarineClassAdditive
    } = this

    const shipTypeAdditive = submarineClassAdditive
    const multiplicative =
      landingCraftsImprovementMultiplicative *
      specialAmphibiousTanksImprovementMultiplicative *
      tokuDaihatsuMultiplicative *
      shikonModifiers.multiplicative
    const additive = wgAdditive + shikonModifiers.additive

    return { shipTypeAdditive, multiplicative, additive }
  }

  get antiSoftSkinnedModifiers() {
    const { wgCount, commonModifiers, countGear, countGearCategory, hasGearCategory } = this

    let { multiplicative } = commonModifiers
    const { shipTypeAdditive, additive } = commonModifiers

    if (hasGearCategory('AntiAircraftShell')) {
      multiplicative *= 2.5
    }

    if (wgCount >= 1) {
      multiplicative *= 1.3
    }
    if (wgCount >= 2) {
      multiplicative *= 1.4
    }

    if (hasGearCategory('SeaplaneBomber', 'SeaplaneFighter')) {
      multiplicative *= 1.2
    }

    if (hasGearCategory('LandingCraft')) {
      multiplicative *= 1.4
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      multiplicative *= 1.5
    }
    if (count166 >= 2) {
      multiplicative *= 1.3
    }

    // 内火艇
    const countSpecialAmphibiousTank = countGearCategory('SpecialAmphibiousTank')
    if (countSpecialAmphibiousTank >= 1) {
      multiplicative *= 1.5
    }
    if (countSpecialAmphibiousTank >= 2) {
      multiplicative *= 1.2
    }

    return { shipTypeAdditive, additive, multiplicative }
  }

  get antiPillboxModifiers() {
    const { ship, wgCount, commonModifiers, countGear, hasGearCategory, countGearCategory } = this
    const { shipType } = ship

    let { multiplicative } = commonModifiers
    const { shipTypeAdditive, additive } = commonModifiers

    if (hasGearCategory('ArmorPiercingShell')) {
      multiplicative *= 1.85
    }

    if (wgCount >= 1) {
      multiplicative *= 1.6
    }
    if (wgCount >= 2) {
      multiplicative *= 1.7
    }

    if (hasGearCategory('SeaplaneBomber', 'SeaplaneFighter', 'CarrierBasedDiveBomber')) {
      multiplicative *= 1.5
    }

    if (hasGearCategory('LandingCraft')) {
      multiplicative *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      multiplicative *= 1.5
    }
    if (count166 >= 2) {
      multiplicative *= 1.4
    }

    // 内火艇
    const countSpecialAmphibiousTank = countGearCategory('SpecialAmphibiousTank')
    if (countSpecialAmphibiousTank >= 1) {
      multiplicative *= 2.4
    }
    if (countSpecialAmphibiousTank >= 2) {
      multiplicative *= 1.35
    }

    if (shipType.isDestroyer || shipType.isLightCruiserClass) {
      multiplicative *= 1.4
    }

    return { shipTypeAdditive, additive, multiplicative }
  }

  get antiIsolatedIslandModifiers() {
    const { wgCount, commonModifiers, countGear, hasGearCategory, countGearCategory } = this

    let { multiplicative } = commonModifiers
    const { shipTypeAdditive, additive } = commonModifiers

    if (hasGearCategory('AntiAircraftShell')) {
      multiplicative *= 1.75
    }

    if (wgCount >= 1) {
      multiplicative *= 1.4
    }
    if (wgCount >= 2) {
      multiplicative *= 1.5
    }

    if (hasGearCategory('CarrierBasedDiveBomber')) {
      multiplicative *= 1.4
    }

    if (hasGearCategory('LandingCraft')) {
      multiplicative *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      multiplicative *= 1.2
    }
    if (count166 >= 2) {
      multiplicative *= 1.4
    }

    // 内火艇
    const countSpecialAmphibiousTank = countGearCategory('SpecialAmphibiousTank')
    if (countSpecialAmphibiousTank >= 1) {
      multiplicative *= 2.4
    }
    if (countSpecialAmphibiousTank >= 2) {
      multiplicative *= 1.35
    }

    return { shipTypeAdditive, additive, multiplicative }
  }

  get antiSupplyDepotPostCapModifier() {
    const {
      wgCount,
      landingCraftsImprovementMultiplicative,
      specialAmphibiousTanksImprovementMultiplicative,
      countGear,
      hasGearCategory,
      countGearCategory
    } = this
    let multiplicative = 1

    if (wgCount >= 1) {
      multiplicative *= 1.25
    }
    if (wgCount >= 2) {
      multiplicative *= 1.3
    }

    if (hasGearCategory('LandingCraft')) {
      multiplicative *= 1.7
    }

    // 特大発
    if (countGear(193) >= 1) {
      multiplicative *= 1.2
    }

    multiplicative *= landingCraftsImprovementMultiplicative

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countGear(166)
    if (count166 >= 1) {
      multiplicative *= 1.3 * landingCraftsImprovementMultiplicative
    }
    if (count166 >= 2) {
      multiplicative *= 1.6
    }

    const countSpecialAmphibiousTank = countGearCategory('SpecialAmphibiousTank')
    if (countSpecialAmphibiousTank >= 1) {
      multiplicative *= 1.7
    }
    if (countSpecialAmphibiousTank >= 2) {
      multiplicative *= 1.5
    }
    multiplicative *= specialAmphibiousTanksImprovementMultiplicative

    return multiplicative
  }

  public getModifiersFromType = (type: InstallationType) => {
    const modifiers = { shipTypeAdditive: 0, multiplicative: 1, additive: 0, postCapMultiplicative: 1 }
    switch (type) {
      case 'SoftSkinned':
        return { ...modifiers, ...this.antiSoftSkinnedModifiers }
      case 'Pillbox':
        return { ...modifiers, ...this.antiPillboxModifiers }
      case 'IsolatedIsland':
        return { ...modifiers, ...this.antiIsolatedIslandModifiers }
      case 'SupplyDepot':
        return {
          ...modifiers,
          ...this.antiSoftSkinnedModifiers,
          postCapMultiplicative: this.antiSupplyDepotPostCapModifier
        }
    }

    return modifiers
  }
}
