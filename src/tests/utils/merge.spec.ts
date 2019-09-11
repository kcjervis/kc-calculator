import { merge } from "../../utils"

describe("merge", () => {
  it("", () => {
    const target = { value: 1, name: "one" }

    merge(target, { value: 2, name: undefined })
    expect(target).toEqual({ value: 2, name: "one" })

    merge(target, { value: 3, name: "three" })
    expect(target).toEqual({ value: 3, name: "three" })

    merge(target, { value: 4 }, { name: "four" })
    expect(target).toEqual({ value: 4, name: "four" })
  })
})
