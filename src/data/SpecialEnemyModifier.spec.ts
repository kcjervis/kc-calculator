import { compose, getSpecialEnemyModifier } from "./SpecialEnemyModifier"
import { makeShip } from "./EquipmentBonus.spec"

const normal = makeShip("駆逐イ級")
const pillbox = makeShip("砲台小鬼")
const supplyDepot = makeShip("集積地棲姫")

const expectModifier = (...params: Parameters<typeof makeShip>) => {
  const ship = makeShip(...params)
  const actual = {
    normal: getSpecialEnemyModifier(ship, normal),
    pillbox: getSpecialEnemyModifier(ship, pillbox),
    supplyDepot: getSpecialEnemyModifier(ship, supplyDepot)
  }
  const toEqual = (expected: typeof actual) => expect(actual).toEqual(expected)
  const toMatchObject = (expected: Partial<typeof actual>) => expect(actual).toMatchObject(expected)
  return { toEqual, toMatchObject }
}

describe("SpecialEnemyModifier", () => {
  it("compose", () => {
    expect(compose({ a5: 1.1 }, { a5: 1.2 }, { a5: 1.3 })).toEqual({ a5: 1.1 * 1.2 * 1.3 })
    expect(compose({ a5: 2, b5: 11 }, { b5: 12 })).toEqual({ a5: 2, b5: 23 })

    expect(compose({ a5: 1.2 }, { a5: 0 })).toEqual({ a5: 0 })
    expect(compose({ b14: 10 }, { b14: 0 })).toEqual({ b14: 10 })
  })

  it("getSpecialEnemyModifier", () => {
    expectModifier("睦月", "WG42 (Wurfgerät 42)").toMatchObject({
      supplyDepot: { a13: 1.3, a5: 1.25, b13next: 75 }
    })
    expectModifier("睦月", "WG42 (Wurfgerät 42)", "WG42 (Wurfgerät 42)").toMatchObject({
      supplyDepot: { a13: 1.82, a5: 1.625, b13next: 110 }
    })

    expectModifier("睦月").toMatchObject({ pillbox: { a13: 1.4 } })
    expectModifier("阿武隈").toMatchObject({ pillbox: { a13: 1.4 } })

    expectModifier("伊19").toMatchObject({ pillbox: { b12: 30 } })
    expectModifier("伊19改").toMatchObject({ pillbox: { b12: 30 } })

    expectModifier("睦月", { name: "大発動艇", star: 10 }).toMatchObject({ normal: {}, pillbox: { a13: 3.024 } })
  })
})
