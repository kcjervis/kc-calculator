import Range from "../../src/ship/Range"

describe("ship/Range", () => {
  it("match", () => {
    const range = new Range(1, 2, 1)
    expect(range).toMatchObject({ naked: 1, equipment: 2, bonus: 1, value: 3, label: "長" })
  })
})
