import { isNonNullable, isMatch, matchNumber, matchString, NumberCondition } from "../../src/utils/isMatch"

describe("isMatch", () => {
  it("isNonNullable", () => {
    expect(isNonNullable(0)).toBe(true)
    expect(isNonNullable("")).toBe(true)

    expect(isNonNullable(undefined)).toBe(false)
    expect(isNonNullable(null)).toBe(false)
  })

  it("matchNumber", () => {
    const value = 3
    const truthConditions: Array<NumberCondition<number>> = [
      3,
      { $lt: 4 },
      { $lte: 3 },
      { $gt: 2 },
      { $gte: 3 },
      { $between: [3, 4] },
      [2, 3, 4]
    ]
    const falsityConditions: Array<NumberCondition<number>> = [
      4,
      { $lt: 3 },
      { $lte: 2 },
      { $gt: 3 },
      { $gte: 4 },
      { $between: [4, 5] },
      [2, 4]
    ]

    truthConditions.forEach(cond => expect(matchNumber(value, cond)).toBe(true))
    falsityConditions.forEach(cond => expect(matchNumber(value, cond)).toBe(false))
  })

  it("matchString", () => {
    expect(matchString("", "")).toBe(true)
    expect(matchString("" as string, "a")).toBe(false)

    expect(matchString("a", ["a", "b"])).toBe(true)
    expect(matchString("a", ["b", "c"])).toBe(false)
  })

  it("isMatch", () => {
    expect(isMatch(null, null)).toBe(true)
    expect(isMatch(undefined, undefined)).toBe(true)

    expect(isMatch(undefined, null)).toBe(false)
    expect(isMatch(1, null)).toBe(false)

    expect(isMatch(true, true)).toBe(true)
    expect(isMatch(1n, 1n)).toBe(true)
    const symbol = Symbol()
    expect(isMatch(symbol, symbol)).toBe(true)

    const object = { id: 1, name: "Alice" }

    expect(isMatch(object, { id: 1, name: "Alice" })).toBe(true)
    expect(isMatch(object, { id: 2, name: "Alice" })).toBe(false)

    expect(isMatch(object, { $and: [{ id: 1 }, { name: "Alice" }] })).toBe(true)
    expect(isMatch(object, { $or: [{ id: 1 }, { id: 2 }] })).toBe(true)
    expect(isMatch(object, { $not: { id: 2 } })).toBe(true)

    expect(isMatch([0, 1], [0, 1])).toBe(true)

    type Id = number | string | { id: number }

    expect(isMatch<Id>("1", 1)).toBe(false)
    expect(isMatch<Id>("1", { $lte: 1 })).toBe(false)
    expect(isMatch<Id>({ id: 1 }, { $gte: 1 })).toBe(false)
  })
})
