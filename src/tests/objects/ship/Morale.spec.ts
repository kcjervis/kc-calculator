import Morale from "../../../objects/ship/Morale"

describe("ship/Morale", () => {
  const makeExpect = (key: keyof Morale) => (value: number) => expect(new Morale(value)[key])

  const red = new Morale(19)
  const orange = new Morale(29)
  const normal = new Morale(49)
  const sparkling = new Morale(50)

  it("state", () => {
    expect(red.state).toBe("Red")
    expect(orange.state).toBe("Orange")
    expect(normal.state).toBe("Normal")
    expect(sparkling.state).toBe("Sparkling")
    expect(new Morale(20).state).toBe("Orange")
    expect(new Morale(30).state).toBe("Normal")
  })

  it("shellingAccuracyModifier", () => {
    const expectation: Array<[Morale, number]> = [[red, 0.5], [orange, 0.8], [normal, 1], [sparkling, 1.2]]
    expectation.forEach(([morale, value]) => {
      expect(morale.shellingAccuracyModifier).toBe(value)
    })
  })

  it("nightBattleAccuracyModifier", () => {
    const expectation: Array<[Morale, number]> = [[red, 0.5], [orange, 0.8], [normal, 1], [sparkling, 1.2]]
    expectation.forEach(([morale, value]) => {
      expect(morale.nightBattleAccuracyModifier).toBe(value)
    })
  })

  it("evasionModifier", () => {
    const expectation: Array<[Morale, number]> = [[red, 1.4], [orange, 1.2], [normal, 1], [sparkling, 0.7]]
    expectation.forEach(([morale, value]) => {
      expect(morale.evasionModifier).toBe(value)
    })
  })
})
