import Improvement from "../../../objects/gear/Improvement"
import { GearAttribute } from "../../../data"
import { createStubbedGearStats } from "../../testUtils"
import { GearStats } from "../../../types"
import { GearId } from "@jervis/data"

describe("gear/Improvement", () => {
  const createImprovement = (value: number | undefined, base: Partial<GearStats>, attrs: GearAttribute[]) => {
    const stats = createStubbedGearStats(base)
    const gearIs = (attr: GearAttribute) => attrs.includes(attr)
    return new Improvement(value, stats, gearIs)
  }

  const makeExpect = (key: keyof Improvement) => (value: number, base: Partial<GearStats>, attrs: GearAttribute[]) =>
    expect(createImprovement(value, base, attrs)[key])

  it("constructor", () => {
    expect(createImprovement(undefined, {}, []).value).toBe(0)
  })

  it("contactSelectionModifier", () => {
    const expectContactSelection = makeExpect("contactSelectionModifier")

    expectContactSelection(0, {}, []).toBe(0)
    expectContactSelection(10, { los: 7 }, ["ReconnaissanceAircraft", "CarrierBasedReconnaissanceAircraft"]).toBe(
      0.25 * 10
    )
    expectContactSelection(10, { los: 11 }, ["ReconnaissanceAircraft", "CarrierBasedReconnaissanceAircraft2"]).toBe(
      0.4 * 10
    )

    expectContactSelection(10, { los: 6 }, ["ReconnaissanceAircraft"]).toBe(0.2 * 10)
    expectContactSelection(10, { los: 4 }, ["ReconnaissanceAircraft"]).toBe(0.14 * 10)
    expectContactSelection(10, { los: 3 }, ["ReconnaissanceAircraft"]).toBe(0.1 * 10)

    expectContactSelection(10, { los: 15 }, ["ReconnaissanceAircraft", "CarrierBasedReconnaissanceAircraft2"]).toBe(0)
    expectContactSelection(10, { los: 0 }, ["ReconnaissanceAircraft"]).toBe(0)
  })

  it("fighterPowerModifier", () => {
    const expectFighterPower = makeExpect("fighterPowerModifier")

    expectFighterPower(10, {}, []).toBe(0)
    expectFighterPower(10, {}, ["Fighter"]).toBe(0.2 * 10)
    expectFighterPower(10, {}, ["CarrierBasedDiveBomber"]).toBe(0.25 * 10)
  })

  it("fighterPowerModifier", () => {
    const expectAdjustedAntiAir = makeExpect("adjustedAntiAirModifier")

    expectAdjustedAntiAir(10, {}, []).toBe(0)
    expectAdjustedAntiAir(10, { antiAir: 10 }, []).toBe(0)

    expectAdjustedAntiAir(10, { antiAir: 7 }, ["AntiAircraftGun"]).toBe(4 * Math.sqrt(10))
    expectAdjustedAntiAir(10, { antiAir: 8 }, ["AntiAircraftGun"]).toBe(6 * Math.sqrt(10))

    expectAdjustedAntiAir(10, { antiAir: 7 }, ["AntiAircraftFireDirector"]).toBe(2 * Math.sqrt(10))
    expectAdjustedAntiAir(10, { antiAir: 8 }, ["AntiAircraftFireDirector"]).toBe(3 * Math.sqrt(10))

    expectAdjustedAntiAir(10, { antiAir: 7 }, ["HighAngleMount"]).toBe(2 * Math.sqrt(10))
    expectAdjustedAntiAir(10, { antiAir: 8 }, ["HighAngleMount"]).toBe(3 * Math.sqrt(10))
  })

  it("fleetAntiAirModifier", () => {
    const expectFleetAntiAir = makeExpect("fleetAntiAirModifier")

    expectFleetAntiAir(10, {}, []).toBe(0)
    expectFleetAntiAir(10, { antiAir: 10 }, []).toBe(0)

    expectFleetAntiAir(10, { antiAir: 7 }, ["AntiAircraftFireDirector"]).toBe(2 * Math.sqrt(10))
    expectFleetAntiAir(10, { antiAir: 8 }, ["AntiAircraftFireDirector"]).toBe(3 * Math.sqrt(10))

    expectFleetAntiAir(10, { antiAir: 8 }, ["AirRadar"]).toBe(1.5 * Math.sqrt(10))
  })

  it("shellingPowerModifier", () => {
    const expectShellingPower = makeExpect("shellingPowerModifier")

    expectShellingPower(10, { firepower: 13 }, []).toBe(1.5 * Math.sqrt(10))
    expectShellingPower(10, {}, []).toBe(0)

    expectShellingPower(10, {}, ["CarrierBasedTorpedoBomber"]).toBe(0.2 * 10)
    expectShellingPower(10, { gearId: GearId["12.7cm連装高角砲"] }, []).toBe(0.2 * 10)
    expectShellingPower(10, { gearId: GearId["15.5cm三連装副砲"] }, []).toBe(0.3 * 10)

    expectShellingPower(10, {}, ["MainGun"]).toBe(Math.sqrt(10))
    expectShellingPower(10, {}, ["Sonar"]).toBe(0.75 * Math.sqrt(10))
  })

  it("shellingAccuracyModifier", () => {
    const expectShellingAccuracy = makeExpect("shellingAccuracyModifier")

    expectShellingAccuracy(10, {}, ["SurfaceRadar"]).toBe(1.7 * Math.sqrt(10))
    expectShellingAccuracy(10, {}, ["MainGun"]).toBe(Math.sqrt(10))
    expectShellingAccuracy(10, {}, []).toBe(0)
  })

  it("effectiveLosModifier", () => {
    const expectEffectiveLos = makeExpect("effectiveLosModifier")

    expectEffectiveLos(10, {}, ["SmallRadar"]).toBe(1.25 * Math.sqrt(10))
    expectEffectiveLos(10, {}, ["LargeRadar"]).toBe(1.4 * Math.sqrt(10))
    expectEffectiveLos(10, {}, ["CarrierBasedReconnaissanceAircraft"]).toBe(1.2 * Math.sqrt(10))
    expectEffectiveLos(10, {}, ["SeaplaneBomber"]).toBe(1.15 * Math.sqrt(10))
    expectEffectiveLos(10, {}, []).toBe(0)
  })

  it("effectiveLosModifier", () => {
    const expectDefensePower = makeExpect("defensePowerModifier")

    expectDefensePower(10, {}, ["MediumExtraArmor"]).toBe(0.2 * 10)
    expectDefensePower(10, {}, ["LargeExtraArmor"]).toBe(0.3 * 10)
    expectDefensePower(10, {}, []).toBe(0)
  })
})
