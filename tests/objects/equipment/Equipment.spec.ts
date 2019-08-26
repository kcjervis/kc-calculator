import { Equipment } from "../../../src/objects/Equipment"

describe("equipment/Equipment", () => {
  type MockGear = { masterId: number; firepower: number }
  const mockGears: MockGear[] = [{ masterId: 1, firepower: 0 }, { masterId: 2, firepower: 2 }]
  const equipment = new Equipment(mockGears, [0, 0, 0])

  it("count", () => {
    expect(equipment.count()).toBe(2)
  })

  it("has", () => {
    expect(equipment.has(gear => gear.firepower === 2)).toBe(true)
    expect(equipment.has(2)).toBe(true)
    expect(equipment.has(0)).toBe(false)
  })
})
