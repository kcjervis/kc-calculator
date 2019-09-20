import ShipClass from "../../data/ShipClass"

describe("ShipClass", () => {
  it("all", () => {
    expect(ShipClass.all.length).toBeGreaterThan(0)
  })
})
