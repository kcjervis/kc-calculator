import { includes } from "../../utils"

describe("typeGuards", () => {
  it("includes", () => {
    const types = ["type1", "type2", 1] as const
    expect(includes(types, "type1")).toBe(true)
    expect(includes(types, 3)).toBe(false)
  })
})
