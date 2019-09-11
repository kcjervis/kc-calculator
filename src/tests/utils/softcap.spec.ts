import { softcap } from "../../utils"

describe("softcap", () => {
  it("softcap", () => {
    expect(softcap(150, 150)).toBe(150)
    expect(softcap(150, 180)).toBe(150 + Math.sqrt(30))
  })
})
