import { api_mst_slotitem_equiptype, GearId } from "@jervis/data"

export enum GearCategoryId {
  /** 小口径主砲 */
  SmallCaliberMainGun = 1,

  /** 中口径主砲 */
  MediumCaliberMainGun = 2,

  /** 大口径主砲 */
  LargeCaliberMainGun = 3,

  /** 副砲 */
  SecondaryGun = 4,

  /** 魚雷 */
  Torpedo = 5,

  /** 艦上戦闘機 */
  CarrierBasedFighterAircraft = 6,

  /** 艦上爆撃機 */
  CarrierBasedDiveBomber = 7,

  /** 艦上攻撃機 */
  CarrierBasedTorpedoBomber = 8,

  /** 艦上偵察機 */
  CarrierBasedReconnaissanceAircraft = 9,

  /** 水上偵察機 */
  ReconnaissanceSeaplane = 10,

  /** 水上爆撃機 */
  SeaplaneBomber = 11,

  /** 小型電探 */
  SmallRadar = 12,

  /** 大型電探 */
  LargeRadar = 13,

  /** ソナー */
  Sonar = 14,

  /** 爆雷 */
  DepthCharge = 15,

  /** 追加装甲 */
  ExtraArmor = 16,

  /** 機関部強化 */
  EngineImprovement = 17,

  /** 対空強化弾 */
  AntiAircraftShell = 18,

  /** 対艦強化弾 */
  ArmorPiercingShell = 19,

  /** VT信管 */
  VTFuze = 20,

  /** 対空機銃 */
  AntiAircraftGun = 21,

  /** 特殊潜航艇 */
  MidgetSubmarine = 22,

  /** 応急修理要員 */
  EmergencyRepairPersonnel = 23,

  /** 上陸用舟艇 */
  LandingCraft = 24,

  /** オートジャイロ */
  Autogyro = 25,

  /** 対潜哨戒機 */
  AntiSubmarinePatrolAircraft = 26,

  /** 追加装甲（中型) */
  MediumExtraArmor = 27,

  /** 追加装甲（大型) */
  LargeExtraArmor = 28,

  /** 探照灯 */
  Searchlight = 29,

  /** 簡易輸送部材 */
  SupplyTransportContainer = 30,

  /** 艦艇修理施設 */
  ShipRepairFacility = 31,

  /** 潜水艦魚雷 */
  SubmarineTorpedo = 32,

  /** 照明弾 */
  StarShell = 33,

  /** 司令部施設 */
  CommandFacility = 34,

  /** 航空要員 */
  AviationPersonnel = 35,

  /** 高射装置 */
  AntiAircraftFireDirector = 36,

  /** 対地装備 */
  AntiGroundEquipment = 37,

  /** 大口径主砲(II) */
  LargeCaliberMainGun2 = 38,

  /** 水上艦要員 */
  SurfaceShipPersonnel = 39,

  /** 大型ソナー */
  LargeSonar = 40,

  /** 大型飛行艇 */
  LargeFlyingBoat = 41,

  /** 大型探照灯 */
  LargeSearchlight = 42,

  /** 戦闘糧食 */
  CombatRation = 43,

  /** 補給物資 */
  Supplies = 44,

  /** 水上戦闘機 */
  SeaplaneFighter = 45,

  /** 特型内火艇 */
  SpecialAmphibiousTank = 46,

  /** 陸上攻撃機 */
  LandBasedAttackAircraft = 47,

  /** 局地戦闘機 */
  LandBasedFighter = 48,

  /** 陸上偵察機 */
  LandBasedReconnaissanceAircraft = 49,

  /** 輸送機材 */
  TransportationMaterial = 50,

  /** 潜水艦装備 */
  SubmarineEquipment = 51,

  /** 噴式戦闘機 */
  JetPoweredFighter = 56,

  /** 噴式戦闘爆撃機 */
  JetPoweredFighterBomber = 57,

  /** 噴式攻撃機 */
  JetPoweredTorpedoBomber = 58,

  /** 噴式索敵機 */
  JetPoweredReconnaissanceAircraft = 59,

  /** 大型電探(II) */
  LargeRadar2 = 93,

  /** 艦上偵察機(II) */
  CarrierBasedReconnaissanceAircraft2 = 94
}

export type GearCategoryKey = keyof typeof GearCategoryId

export const matchesCategory = (...keys: GearCategoryKey[]) => (id: number) =>
  keys.some(key => GearCategoryId[key] === id)

export default class GearCategory {
  public static readonly all = api_mst_slotitem_equiptype.map(
    ({ api_id, api_name }) => new GearCategory(api_id, api_name)
  )

  public static find(categoryId: number, masterId: number) {
    if (masterId === GearId["試製51cm連装砲"] || masterId === GearId["51cm連装砲"]) {
      categoryId = GearCategoryId.LargeCaliberMainGun2
    } else if (masterId === GearId["15m二重測距儀+21号電探改二"]) {
      categoryId = GearCategoryId.LargeRadar2
    } else if (masterId === GearId["試製景雲(艦偵型)"]) {
      categoryId = GearCategoryId.CarrierBasedReconnaissanceAircraft2
    }

    const found = GearCategory.all.find(category => category.id === categoryId)
    if (found) {
      return found
    }
    const newCategory = new GearCategory(categoryId, "")
    this.all.push(newCategory)
    return newCategory
  }

  private constructor(public readonly id: GearCategoryId, public readonly name: string) {}

  public is = (key: GearCategoryKey) => {
    return this.id === GearCategoryId[key]
  }

  public either = (...keys: GearCategoryKey[]) => {
    return keys.some(this.is)
  }

  /** 電探 */
  get isRadar() {
    return this.either("SmallRadar", "LargeRadar", "LargeRadar2")
  }

  /** 艦載機 */
  get isCarrierBasedAircraft() {
    return this.either(
      "CarrierBasedFighterAircraft",
      "CarrierBasedDiveBomber",
      "CarrierBasedTorpedoBomber",
      "CarrierBasedReconnaissanceAircraft",
      "CarrierBasedReconnaissanceAircraft2"
    )
  }

  /** 水上機 */
  get isSeaplane() {
    return this.either("ReconnaissanceSeaplane", "SeaplaneBomber", "SeaplaneFighter", "LargeFlyingBoat")
  }

  /** 陸上機 */
  get isLandBasedAircraft() {
    return this.either("LandBasedAttackAircraft", "LandBasedFighter", "LandBasedReconnaissanceAircraft")
  }

  /** 噴式機 */
  get isJetPoweredAircraft() {
    return this.either(
      "JetPoweredFighter",
      "JetPoweredFighterBomber",
      "JetPoweredTorpedoBomber",
      "JetPoweredReconnaissanceAircraft"
    )
  }

  /** 戦闘機 */
  get isFighter() {
    return this.either("CarrierBasedFighterAircraft", "SeaplaneFighter", "LandBasedFighter", "JetPoweredFighter")
  }

  /** 爆撃機 */
  get isDiveBomber() {
    return this.either("CarrierBasedDiveBomber", "SeaplaneBomber", "JetPoweredFighterBomber")
  }

  /** 攻撃機 */
  get isTorpedoBomber() {
    return this.either("CarrierBasedTorpedoBomber", "JetPoweredTorpedoBomber", "LandBasedAttackAircraft")
  }

  /** 偵察機 */
  get isReconnaissanceAircraft() {
    return this.either(
      "CarrierBasedReconnaissanceAircraft",
      "CarrierBasedReconnaissanceAircraft2",
      "ReconnaissanceSeaplane",
      "LargeFlyingBoat",
      "JetPoweredReconnaissanceAircraft",
      "LandBasedReconnaissanceAircraft"
    )
  }

  /** 空母砲撃する航空機 */
  get isCarrierShellingAircraft() {
    return this.either(
      "CarrierBasedDiveBomber",
      "CarrierBasedTorpedoBomber",
      "JetPoweredFighterBomber",
      "JetPoweredTorpedoBomber"
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
      either("Autogyro", "AntiSubmarinePatrolAircraft")
    )
  }

  get isArmor() {
    return this.either("ExtraArmor", "MediumExtraArmor", "LargeExtraArmor")
  }

  get isObservationPlane() {
    return this.either("SeaplaneBomber", "ReconnaissanceSeaplane")
  }

  get isMainGun() {
    return this.either("SmallCaliberMainGun", "MediumCaliberMainGun", "LargeCaliberMainGun", "LargeCaliberMainGun2")
  }
}
