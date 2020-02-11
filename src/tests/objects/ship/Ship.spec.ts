import { makeShip } from "../../testUtils"

describe("Ship", () => {
  it("getCruiserFitBonus", () => {
    expect(makeShip("天龍改二", "14cm単装砲").getCruiserFitBonus()).toBe(1)
    expect(makeShip("由良改二", "14cm単装砲", "14cm単装砲").getCruiserFitBonus()).toBe(Math.sqrt(2))
  })
})
