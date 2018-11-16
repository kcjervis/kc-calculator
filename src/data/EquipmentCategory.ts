import { api_mst_slotitem_equiptype } from '@kancolle/data'
import EquipmentCategoryId from './EquipmentCategoryId'

export default class EquipmentCategory {
  public static readonly all = api_mst_slotitem_equiptype.map(
    ({ api_id, api_name }) => new EquipmentCategory(api_id, api_name)
  )

  public static fromId(id: EquipmentCategoryId) {
    const found = EquipmentCategory.all.find(category => category.id === id)
    if (found) {
      return found
    }
    const newCategory = new EquipmentCategory(id, '')
    this.all.push(newCategory)
    return newCategory
  }

  private constructor(public readonly id: EquipmentCategoryId, public readonly name: string) {}

  public equal(key: keyof typeof EquipmentCategoryId) {
    return this.id === EquipmentCategoryId[key]
  }
  /** 電探 */
  get isRadar() {
    switch (this.id) {
      case EquipmentCategoryId.SmallRadar:
      case EquipmentCategoryId.LargeRadar:
      case EquipmentCategoryId.LargeRadar2:
        return true
    }
    return false
  }

  /** 艦載機 */
  get isCarrierBasedAircraft() {
    switch (this.id) {
      case EquipmentCategoryId.CarrierBasedFighterAircraft:
      case EquipmentCategoryId.CarrierBasedDiveBomber:
      case EquipmentCategoryId.CarrierBasedTorpedoBomber:
      case EquipmentCategoryId.CarrierBasedReconnaissanceAircraft:
      case EquipmentCategoryId.CarrierBasedReconnaissanceAircraft2:
        return true
    }
    return false
  }

  /** 水上機 */
  get isSeaplane() {
    switch (this.id) {
      case EquipmentCategoryId.ReconnaissanceSeaplane:
      case EquipmentCategoryId.SeaplaneBomber:
      case EquipmentCategoryId.LargeFlyingBoat:
      case EquipmentCategoryId.SeaplaneFighter:
        return true
    }
    return false
  }

  /** 陸上機 */
  get isLandBasedAircraft() {
    switch (this.id) {
      case EquipmentCategoryId.LandBasedAttackAircraft:
      case EquipmentCategoryId.LandBasedFighter:
        return true
    }
    return false
  }

  /** 噴式機 */
  get isJetPoweredAircraft() {
    switch (this.id) {
      case EquipmentCategoryId.JetPoweredFighter:
      case EquipmentCategoryId.JetPoweredFighterBomber:
      case EquipmentCategoryId.JetPoweredTorpedoBomber:
      case EquipmentCategoryId.JetPoweredReconnaissanceAircraft:
        return true
    }
    return false
  }

  /** 戦闘機 */
  get isFighter() {
    switch (this.id) {
      case EquipmentCategoryId.CarrierBasedFighterAircraft:
      case EquipmentCategoryId.SeaplaneFighter:
      case EquipmentCategoryId.LandBasedFighter:
      case EquipmentCategoryId.JetPoweredFighter:
        return true
    }
    return false
  }

  /** 爆撃機 */
  get isDiveBomber() {
    switch (this.id) {
      case EquipmentCategoryId.CarrierBasedDiveBomber:
      case EquipmentCategoryId.SeaplaneBomber:
      case EquipmentCategoryId.JetPoweredFighterBomber:
        return true
    }
    return false
  }

  /** 攻撃機 */
  get isTorpedoBomber() {
    switch (this.id) {
      case EquipmentCategoryId.CarrierBasedTorpedoBomber:
      case EquipmentCategoryId.LandBasedAttackAircraft:
      case EquipmentCategoryId.JetPoweredTorpedoBomber:
        return true
    }
    return false
  }

  /** 偵察機 */
  get isReconnaissanceAircraft() {
    switch (this.id) {
      case EquipmentCategoryId.CarrierBasedReconnaissanceAircraft:
      case EquipmentCategoryId.CarrierBasedReconnaissanceAircraft2:
      case EquipmentCategoryId.ReconnaissanceSeaplane:
      case EquipmentCategoryId.LargeFlyingBoat:
      case EquipmentCategoryId.JetPoweredReconnaissanceAircraft:
        return true
    }
    return false
  }

  /** 航空戦に参加する航空機 */
  get isAerialCombatAircraft() {
    return this.isFighter || this.isDiveBomber || this.isTorpedoBomber || this.isReconnaissanceAircraft
  }

  get isAircraft() {
    switch (this.id) {
      case EquipmentCategoryId.Autogyro:
      case EquipmentCategoryId.AntiSubmarinePatrolAircraft:
        return true
    }
    return this.isAerialCombatAircraft
  }
}
