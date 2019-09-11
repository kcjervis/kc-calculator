import GearCategory, { GearCategoryKey } from "./GearCategory"
import { GearStats } from "../types"
import { GearId } from "@jervis/data"

export type GearMatcher = (stats: GearStats) => boolean

const createCategoryMatcher = (...keys: GearCategoryKey[]): GearMatcher => stats =>
  keys.map(GearCategory.keyToId).includes(stats.categoryId)

const and = (...args: GearMatcher[]): GearMatcher => stats => args.every(arg => arg(stats))
const or = (...args: GearMatcher[]): GearMatcher => stats => args.some(arg => arg(stats))

export const isAbyssal: GearMatcher = stats => stats.gearId > 500

export const isHighAngleMount: GearMatcher = stats => stats.iconId === 16

export const isMainGun = createCategoryMatcher(
  "SmallCaliberMainGun",
  "MediumCaliberMainGun",
  "LargeCaliberMainGun",
  "LargeCaliberMainGun2"
)

export const isRadar = createCategoryMatcher("SmallRadar", "LargeRadar", "LargeRadar2")
export const isSurfaceRadar = and(isRadar, stats => stats.los >= 5)
export const isAirRadar = and(isRadar, stats => stats.antiAir >= 2)

export const isArmor = createCategoryMatcher("ExtraArmor", "MediumExtraArmor", "LargeExtraArmor")

/** 艦載機 */
export const isCarrierBasedAircraft = createCategoryMatcher(
  "CarrierBasedFighterAircraft",
  "CarrierBasedDiveBomber",
  "CarrierBasedTorpedoBomber",
  "CarrierBasedReconnaissanceAircraft",
  "CarrierBasedReconnaissanceAircraft2"
)

/** 水上機 */
export const isSeaplane = createCategoryMatcher(
  "ReconnaissanceSeaplane",
  "SeaplaneBomber",
  "SeaplaneFighter",
  "LargeFlyingBoat"
)

/** 陸上機 */
export const isLandBasedAircraft = createCategoryMatcher(
  "LandBasedAttackAircraft",
  "LandBasedFighter",
  "LandBasedReconnaissanceAircraft"
)

/** 噴式機 */
export const isJetPoweredAircraft = createCategoryMatcher(
  "JetPoweredFighter",
  "JetPoweredFighterBomber",
  "JetPoweredTorpedoBomber",
  "JetPoweredReconnaissanceAircraft"
)

/** 戦闘機 */
export const isFighter = createCategoryMatcher(
  "CarrierBasedFighterAircraft",
  "SeaplaneFighter",
  "LandBasedFighter",
  "JetPoweredFighter"
)

/** 対地艦爆 */
export const isAntiInstallationBomber: GearMatcher = stats =>
  [
    GearId["零式艦戦62型(爆戦)"],
    GearId["Ju87C改"],
    GearId["Ju87C改二(KMX搭載機)"],
    GearId["Ju87C改二(KMX搭載機/熟練)"],
    GearId["試製南山"],
    GearId["F4U-1D"],
    GearId["FM-2"],
    GearId["彗星一二型(六三四空/三号爆弾搭載機)"]
  ].includes(stats.gearId)

const createMatchers = <T extends string>(matchers: { [K in T]: GearMatcher }) => matchers

const matchers = createMatchers({
  Abyssal: isAbyssal,

  HighAngleMount: isHighAngleMount,

  MainGun: isMainGun,

  Radar: isRadar,
  SurfaceRadar: isSurfaceRadar,
  AirRadar: isAirRadar,

  Armor: isArmor,

  CarrierBasedAircraft: isCarrierBasedAircraft,
  Seaplane: isSeaplane,
  LandBasedAircraft: isLandBasedAircraft,
  JetPoweredAircraft: isJetPoweredAircraft,
  Fighter: isFighter,
  AntiInstallationBomber: isAntiInstallationBomber
})

export type GearMatcherAttribute = keyof typeof matchers
const matcherAttrs = Object.keys(matchers) as GearMatcherAttribute[]

const statsToMatcherAttrs = (stats: GearStats) => matcherAttrs.filter(attr => matchers[attr](stats))

type GearAttribute = GearMatcherAttribute | GearCategoryKey
const GearAttribute = {
  from: (stats: GearStats) => {
    const attrs: GearAttribute[] = statsToMatcherAttrs(stats)

    const categoryKey = GearCategory.numberToKey(stats.categoryId)
    if (categoryKey) {
      attrs.push(categoryKey)
    }

    return attrs
  }
}

export default GearAttribute
