import Gear from "../../../objects/gear/Gear"
import { GearStats } from "../../../types"
import { GearCategory } from "../../../data"
import { createStubbedGearStats, createStubbedImprovement, createStubbedProficiency } from "../../testUtils"

describe("gear/Gear", () => {
  const stats = createStubbedGearStats()
  const category = GearCategory.find(stats.categoryId, stats.gearId)
  const improvement = createStubbedImprovement()
  const proficiency = createStubbedProficiency()

  const gearIs = jest.fn(() => false)

  const gear = new Gear(stats, category, improvement, proficiency, gearIs)

  it("has stats", () => {
    Object.entries(stats).forEach(([key, value]) => {
      expect(gear[key as keyof typeof stats]).toBe(value)
    })

    expect(gear.gearId).toBe(gear.masterId)
    expect(gear.toState()).toEqual({
      masterId: stats.gearId,
      improvement: improvement.value,
      proficiency: proficiency.internal
    })
  })
})
