import GearAttribute, {
  GearMatcherAttribute,
  GearMatcher,
  isAbyssal,
  isRadar,
  isAirRadar,
  isSurfaceRadar,
  isHighAngleMount,
  isMainGun,
  isArmor,
  isAntiInstallationBomber,
  isSeaplane,
  isLandBasedAircraft,
  isCarrierBasedAircraft,
  isJetPoweredAircraft
} from "../../data/GearAttribute"
import { GearStats } from "../../types"
import { GearCategoryId, GearCategoryKey } from "../../data/GearCategory"
import { StubbedGearStats, TypeEq, assertType } from "../testUtils"
import { GearId } from "@jervis/data"

const matcherTest = (matcher: GearMatcher, stats: Partial<GearStats>) => {
  const stub = new StubbedGearStats(stats)
  return expect(matcher(stub))
}

describe("GearAttribute", () => {
  type Repetition = Extract<GearMatcherAttribute, GearCategoryKey>
  assertType<TypeEq<Repetition, never>>()

  it("isAbyssal", () => {
    matcherTest(isAbyssal, { gearId: 501 }).toBe(true)
    matcherTest(isAbyssal, { gearId: 500 }).toBe(false)
  })

  it("isHighAngleMount", () => {
    matcherTest(isHighAngleMount, { iconId: 16 }).toBe(true)
    matcherTest(isHighAngleMount, { iconId: 15 }).toBe(false)
  })

  it("isMainGun", () => {
    const mainGuns = [
      GearCategoryId.SmallCaliberMainGun,
      GearCategoryId.MediumCaliberMainGun,
      GearCategoryId.LargeCaliberMainGun,
      GearCategoryId.LargeCaliberMainGun2
    ]

    mainGuns.forEach(categoryId => matcherTest(isMainGun, { categoryId }))
    matcherTest(isMainGun, { categoryId: GearCategoryId.SecondaryGun }).toBe(false)
  })

  const radars = [GearCategoryId.SmallRadar, GearCategoryId.LargeRadar, GearCategoryId.LargeRadar2]

  it("isRadar", () => {
    radars.forEach(categoryId => matcherTest(isRadar, { categoryId }).toBe(true))
    matcherTest(isRadar, { categoryId: GearCategoryId.Sonar }).toBe(false)
  })

  it("isAirRadar", () => {
    const categoryId = GearCategoryId.SmallRadar
    matcherTest(isAirRadar, { categoryId, antiAir: 2 }).toBe(true)
    matcherTest(isAirRadar, { categoryId, antiAir: 1 }).toBe(false)
  })

  it("isSurfaceRadar", () => {
    const categoryId = GearCategoryId.SmallRadar
    matcherTest(isSurfaceRadar, { categoryId, los: 5 }).toBe(true)
    matcherTest(isSurfaceRadar, { categoryId, los: 4 }).toBe(false)
  })

  it("isArmor", () => {
    const armors = [GearCategoryId.ExtraArmor, GearCategoryId.MediumExtraArmor, GearCategoryId.LargeExtraArmor]
    armors.forEach(categoryId => matcherTest(isArmor, { categoryId }).toBe(true))
    matcherTest(isArmor, { categoryId: GearCategoryId.SmallRadar }).toBe(false)
  })

  it("isCarrierBasedAircraft", () => {
    const truthyCategories = [
      GearCategoryId.CarrierBasedFighterAircraft,
      GearCategoryId.CarrierBasedDiveBomber,
      GearCategoryId.CarrierBasedTorpedoBomber,
      GearCategoryId.CarrierBasedReconnaissanceAircraft,
      GearCategoryId.CarrierBasedReconnaissanceAircraft2
    ]
    truthyCategories.forEach(categoryId => matcherTest(isCarrierBasedAircraft, { categoryId }).toBe(true))

    matcherTest(isCarrierBasedAircraft, { categoryId: GearCategoryId.SeaplaneFighter }).toBe(false)
  })

  it("isSeaplane", () => {
    const seaplanes = [
      GearCategoryId.ReconnaissanceSeaplane,
      GearCategoryId.SeaplaneBomber,
      GearCategoryId.SeaplaneFighter,
      GearCategoryId.LargeFlyingBoat
    ]
    seaplanes.forEach(categoryId => matcherTest(isSeaplane, { categoryId }).toBe(true))

    matcherTest(isSeaplane, { categoryId: GearCategoryId.CarrierBasedFighterAircraft }).toBe(false)
  })

  it("isLandBasedAircraft", () => {
    const truthyCategories = [
      GearCategoryId.LandBasedAttackAircraft,
      GearCategoryId.LandBasedFighter,
      GearCategoryId.LandBasedReconnaissanceAircraft
    ]
    truthyCategories.forEach(categoryId => matcherTest(isLandBasedAircraft, { categoryId }).toBe(true))

    matcherTest(isSeaplane, { categoryId: GearCategoryId.CarrierBasedFighterAircraft }).toBe(false)
  })

  it("isJetPoweredAircraft", () => {
    const truthyCategories = [
      GearCategoryId.JetPoweredFighter,
      GearCategoryId.JetPoweredFighterBomber,
      GearCategoryId.JetPoweredTorpedoBomber,
      GearCategoryId.JetPoweredReconnaissanceAircraft
    ]
    truthyCategories.forEach(categoryId => matcherTest(isJetPoweredAircraft, { categoryId }).toBe(true))

    matcherTest(isJetPoweredAircraft, { categoryId: GearCategoryId.CarrierBasedFighterAircraft }).toBe(false)
  })

  it("isAntiInstallationBomber", () => {
    matcherTest(isAntiInstallationBomber, { gearId: GearId["彗星一二型(六三四空/三号爆弾搭載機)"] }).toBe(true)
    matcherTest(isAntiInstallationBomber, { gearId: GearId["彗星一二型(三一号光電管爆弾搭載機)"] }).toBe(false)
  })

  it("GearAttribute.from", () => {
    const stats = new StubbedGearStats({ categoryId: GearCategoryId.LargeRadar, antiAir: 2 })
    const attrs = GearAttribute.from(stats)

    expect(attrs.includes("Radar")).toBe(true)
    expect(attrs.includes("AirRadar")).toBe(true)
    expect(attrs.includes("LargeRadar")).toBe(true)

    expect(attrs.includes("SurfaceRadar")).toBe(false)
    expect(attrs.includes("MainGun")).toBe(false)
    expect(attrs.includes("SmallRadar")).toBe(false)
  })
})
