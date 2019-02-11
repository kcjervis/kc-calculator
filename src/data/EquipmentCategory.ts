import { api_mst_slotitem_equiptype } from '../../data'
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

  public is = (key: keyof typeof EquipmentCategoryId) => {
    return this.id === EquipmentCategoryId[key]
  }

  public either = (...keys: Array<keyof typeof EquipmentCategoryId>) => {
    return keys.some(this.is)
  }

  /** 電探 */
  get isRadar() {
    return this.either('SmallRadar', 'LargeRadar', 'LargeRadar2')
  }

  /** 艦載機 */
  get isCarrierBasedAircraft() {
    return this.either(
      'CarrierBasedFighterAircraft',
      'CarrierBasedDiveBomber',
      'CarrierBasedTorpedoBomber',
      'CarrierBasedReconnaissanceAircraft',
      'CarrierBasedReconnaissanceAircraft2'
    )
  }

  /** 水上機 */
  get isSeaplane() {
    return this.either('ReconnaissanceSeaplane', 'SeaplaneBomber', 'SeaplaneFighter', 'LargeFlyingBoat')
  }

  /** 陸上機 */
  get isLandBasedAircraft() {
    return this.either('LandBasedAttackAircraft', 'LandBasedFighter', 'LandBasedReconnaissanceAircraft')
  }

  /** 噴式機 */
  get isJetPoweredAircraft() {
    return this.either(
      'JetPoweredFighter',
      'JetPoweredFighterBomber',
      'JetPoweredTorpedoBomber',
      'JetPoweredReconnaissanceAircraft'
    )
  }

  /** 戦闘機 */
  get isFighter() {
    return this.either('CarrierBasedFighterAircraft', 'SeaplaneFighter', 'LandBasedFighter', 'JetPoweredFighter')
  }

  /** 爆撃機 */
  get isDiveBomber() {
    return this.either('CarrierBasedDiveBomber', 'SeaplaneBomber', 'JetPoweredFighterBomber')
  }

  /** 攻撃機 */
  get isTorpedoBomber() {
    return this.either('CarrierBasedTorpedoBomber', 'JetPoweredTorpedoBomber', 'LandBasedAttackAircraft')
  }

  /** 偵察機 */
  get isReconnaissanceAircraft() {
    return this.either(
      'CarrierBasedReconnaissanceAircraft',
      'CarrierBasedReconnaissanceAircraft2',
      'ReconnaissanceSeaplane',
      'LargeFlyingBoat',
      'JetPoweredReconnaissanceAircraft',
      'LandBasedReconnaissanceAircraft'
    )
  }

  /** 航空戦に参加する航空機 */
  get isAerialCombatAircraft() {
    return this.isFighter || this.isDiveBomber || this.isTorpedoBomber || this.isReconnaissanceAircraft
  }

  get isAircraft() {
    const { isFighter, isDiveBomber, isTorpedoBomber, isReconnaissanceAircraft, either } = this

    return (
      isFighter ||
      isDiveBomber ||
      isTorpedoBomber ||
      isReconnaissanceAircraft ||
      either('Autogyro', 'AntiSubmarinePatrolAircraft')
    )
  }

  get isArmor() {
    return this.either('ExtraArmor', 'MediumExtraArmor', 'LargeExtraArmor')
  }

  get isObservationPlane() {
    return this.either('SeaplaneBomber', 'ReconnaissanceSeaplane')
  }

  get isMainGun() {
    return this.either('SmallCaliberMainGun', 'MediumCaliberMainGun', 'LargeCaliberMainGun', 'LargeCaliberMainGun2')
  }
}
