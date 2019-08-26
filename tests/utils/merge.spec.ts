import { merge } from "../../src"

describe("merge", () => {
  it("", () => {
    const target = { value: 1, name: "one" }
    merge(target, { name: undefined, value: 2 })
    expect(target).toEqual({ value: 2, name: "one" })

    merge(target, { value: 3, name: "three" })
    expect(target).toEqual({ value: 3, name: "three" })
  })
})
