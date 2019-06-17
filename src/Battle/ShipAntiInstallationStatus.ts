import { IShip } from '../objects'
import { sumBy } from 'lodash-es'
import { nonNullable } from '../utils'
import { InstallationType } from '../types'

export default class ShipAntiInstallationStatus {
  constructor(private ship: IShip) {}

  private get items() {
    return this.ship.equipments.filter(nonNullable)
  }

  private get countEquipment() {
    return this.ship.countEquipment
  }

  private get countEquipmentCategory() {
    return this.ship.countEquipmentCategory
  }

  private get hasEquipmentCategory() {
    return this.ship.hasEquipmentCategory
  }

  private get wgCount() {
    return this.countEquipmentCategory('AntiGroundEquipment')
  }

  /**
   * 対地艦爆
   * id60 零式艦戦62型(爆戦)
   * id64 Ju87C改
   * id148 試製南山
   * id305 Ju87C改二(KMX搭載機)
   * id306 Ju87C改二(KMX搭載機/熟練)
   * id233 F4U-1D
   * id277 FM-2
   */
  get bombing() {
    return sumBy(
      this.items.filter(item => [60, 64, 148, 233, 277, 305, 306, 316, 319].includes(item.masterId)),
      item => item.bombing
    )
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
    const landingCrafts = this.items.filter(item => item.category.is('LandingCraft'))
    if (landingCrafts.length === 0) {
      return 1
    }

    const average = sumBy(landingCrafts, item => item.improvement.value) / landingCrafts.length
    return 1 + average / 50
  }

  // 内火艇改修補正 共通
  get specialAmphibiousTanksImprovementMultiplicative() {
    const tanks = this.items.filter(item => item.category.is('SpecialAmphibiousTank'))
    if (tanks.length === 0) {
      return 1
    }
    const average = sumBy(tanks, item => item.improvement.value) / tanks.length
    return 1 + average / 30
  }

  // 特大発 共通
  get tokuDaihatsuMultiplicative() {
    if (this.ship.hasEquipment(193)) {
      return 1.15
    }
    return 1
  }

  // 特大発動艇＋戦車第11連隊 共通
  get shikonModifiers() {
    const count230 = this.countEquipment(230)
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
    const { wgCount, commonModifiers, countEquipment, countEquipmentCategory, hasEquipmentCategory } = this

    let { shipTypeAdditive, multiplicative, additive } = commonModifiers

    if (hasEquipmentCategory('AntiAircraftShell')) {
      multiplicative *= 2.5
    }

    if (wgCount >= 1) {
      multiplicative *= 1.3
    }
    if (wgCount >= 2) {
      multiplicative *= 1.4
    }

    if (hasEquipmentCategory('SeaplaneBomber', 'SeaplaneFighter')) {
      multiplicative *= 1.2
    }

    if (hasEquipmentCategory('LandingCraft')) {
      multiplicative *= 1.4
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countEquipment(166)
    if (count166 >= 1) {
      multiplicative *= 1.5
    }
    if (count166 >= 2) {
      multiplicative *= 1.3
    }

    // 内火艇
    const countSpecialAmphibiousTank = countEquipmentCategory('SpecialAmphibiousTank')
    if (countSpecialAmphibiousTank >= 1) {
      multiplicative *= 1.5
    }
    if (countSpecialAmphibiousTank >= 2) {
      multiplicative *= 1.2
    }

    return { shipTypeAdditive, additive, multiplicative }
  }

  get antiPillboxModifiers() {
    const { ship, wgCount, commonModifiers, countEquipment, hasEquipmentCategory, countEquipmentCategory } = this
    const { shipType } = ship

    let { shipTypeAdditive, multiplicative, additive } = commonModifiers

    if (hasEquipmentCategory('ArmorPiercingShell')) {
      multiplicative *= 1.85
    }

    if (wgCount >= 1) {
      multiplicative *= 1.6
    }
    if (wgCount >= 2) {
      multiplicative *= 1.7
    }

    if (hasEquipmentCategory('SeaplaneBomber', 'SeaplaneFighter', 'CarrierBasedDiveBomber')) {
      multiplicative *= 1.5
    }

    if (hasEquipmentCategory('LandingCraft')) {
      multiplicative *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countEquipment(166)
    if (count166 >= 1) {
      multiplicative *= 1.5
    }
    if (count166 >= 2) {
      multiplicative *= 1.4
    }

    // 内火艇
    const countSpecialAmphibiousTank = countEquipmentCategory('SpecialAmphibiousTank')
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
    const { wgCount, commonModifiers, countEquipment, hasEquipmentCategory, countEquipmentCategory } = this

    let { shipTypeAdditive, multiplicative, additive } = commonModifiers

    if (hasEquipmentCategory('AntiAircraftShell')) {
      multiplicative *= 1.75
    }

    if (wgCount >= 1) {
      multiplicative *= 1.4
    }
    if (wgCount >= 2) {
      multiplicative *= 1.5
    }

    if (hasEquipmentCategory('CarrierBasedDiveBomber')) {
      multiplicative *= 1.4
    }

    if (hasEquipmentCategory('LandingCraft')) {
      multiplicative *= 1.8
    }

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countEquipment(166)
    if (count166 >= 1) {
      multiplicative *= 1.2
    }
    if (count166 >= 2) {
      multiplicative *= 1.4
    }

    // 内火艇
    const countSpecialAmphibiousTank = countEquipmentCategory('SpecialAmphibiousTank')
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
      countEquipment,
      hasEquipmentCategory,
      countEquipmentCategory
    } = this
    let multiplicative = 1

    if (wgCount >= 1) {
      multiplicative *= 1.25
    }
    if (wgCount >= 2) {
      multiplicative *= 1.3
    }

    if (hasEquipmentCategory('LandingCraft')) {
      multiplicative *= 1.7
    }

    // 特大発
    if (countEquipment(193) >= 1) {
      multiplicative *= 1.2
    }

    multiplicative *= landingCraftsImprovementMultiplicative

    // 大発動艇(八九式中戦車＆陸戦隊)
    const count166 = countEquipment(166)
    if (count166 >= 1) {
      multiplicative *= 1.3 * landingCraftsImprovementMultiplicative
    }
    if (count166 >= 2) {
      multiplicative *= 1.6
    }

    const countSpecialAmphibiousTank = countEquipmentCategory('SpecialAmphibiousTank')
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
