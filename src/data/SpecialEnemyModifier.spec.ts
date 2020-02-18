import { getSpecialEnemyModifiers } from "./SpecialEnemyModifier"
import { makeShip } from "../tests/testUtils"

const normal = makeShip("駆逐イ級")
const pillbox = makeShip("砲台小鬼")
const supplyDepot = makeShip("集積地棲姫")

const expectModifier = (...params: Parameters<typeof makeShip>) => {
  const ship = makeShip(...params)
  const actual = {
    normal: getSpecialEnemyModifiers(ship, normal),
    pillbox: getSpecialEnemyModifiers(ship, pillbox),
    supplyDepot: getSpecialEnemyModifiers(ship, supplyDepot)
  }
  const toEqual = (expected: typeof actual) => expect(actual).toEqual(expected)
  const toMatchObject = (expected: Partial<typeof actual>) => expect(actual).toMatchObject(expected)
  return { toEqual, toMatchObject }
}

describe("SpecialEnemyModifier", () => {
  it("getSpecialEnemyModifiers", () => {
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
