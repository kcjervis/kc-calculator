import GearCategory, { GearCategoryKey } from "./GearCategory"
import { GearStats } from "./MasterGear"
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

const createGearAttribute = <T extends string>(data: { [K in T]: GearMatcher }) => data

const data = createGearAttribute({
  Abyssal: isAbyssal,

  HighAngleMount: isHighAngleMount,

  MainGun: isMainGun,

  Radar: isRadar,
  SurfaceRadar: isSurfaceRadar,
  AirRadar: isAirRadar,

  Armor: isArmor,

  Seaplane: isSeaplane,
  LandBasedAircraft: isLandBasedAircraft,
  AntiInstallationBomber: isAntiInstallationBomber
})

type GearAttribute = keyof typeof data

const GearAttribute = {
  from: (stats: GearStats) => {
    const attrs = Object.keys(data) as GearAttribute[]
    return attrs.filter(attr => data[attr](stats))
  }
}

export default GearAttribute
