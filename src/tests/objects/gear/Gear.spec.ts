import Gear from "../../../objects/gear/Gear"
import { GearStats } from "../../../types"
import { GearCategory, GearAttribute } from "../../../data"
import { createStubbedGearStats, createStubbedImprovement, createStubbedProficiency } from "../../testUtils"
import sift from "sift"

describe("gear/Gear", () => {
  const createGear = (params: {
    stats?: Parameters<typeof createStubbedGearStats>[0]
    improvement?: Parameters<typeof createStubbedImprovement>[0]
    proficiency?: Parameters<typeof createStubbedProficiency>[0]
    attrs?: GearAttribute[]
  }) => {
    const stats = createStubbedGearStats(params.stats)
    const category = GearCategory.find(stats.categoryId, stats.gearId)
    const improvement = createStubbedImprovement(params.improvement)
    const proficiency = createStubbedProficiency(params.proficiency)
    const { attrs = [] } = params
    return new Gear(stats, category, improvement, proficiency, attrs)
  }

  it("has stats", () => {
    const stats = createStubbedGearStats()
    const category = GearCategory.find(stats.categoryId, stats.gearId)
    const improvement = createStubbedImprovement()
    const proficiency = createStubbedProficiency()
    const gear = new Gear(stats, category, improvement, proficiency, [])
    Object.entries(stats).forEach(([key, value]) => {
      expect(gear[key as keyof typeof stats]).toBe(value)
    })

    expect(gear.gearId).toBe(gear.masterId)
    expect(gear.toState()).toEqual({
      gearId: stats.gearId,
      star: improvement.value,
      exp: proficiency.internal
    })
  })

  it("match", () => {
    const gear = createGear({
      stats: { firepower: 5 },
      improvement: { value: 2 },
      attrs: ["Abyssal", "Radar", "AirRadar"]
    })
    expect(gear.match({ firepower: 5 })).toBe(true)
    expect(gear.match({ star: 2 })).toBe(true)

    expect(gear.match({ attrs: "AirRadar" })).toBe(true)
    expect(gear.match({ attrs: { $all: ["Abyssal", "AirRadar"] } })).toBe(true)
    expect(gear.match({ attrs: { $not: "Armor" } })).toBe(true)

    expect(gear.match({ attrs: "Aircraft" })).toBe(false)
  })
})
