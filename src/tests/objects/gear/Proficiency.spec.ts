import Proficiency, { ProficiencyType } from "../../../objects/gear/Proficiency"

describe("gear/Proficiency", () => {
  const makeExpect = (key: keyof Proficiency) => (internal: number, type: ProficiencyType) => {
    return expect(new Proficiency(internal, type)[key])
  }

  it("level", () => {
    const pro = new Proficiency(undefined, "Fighter")
    expect(pro.level).toBe(0)
    pro.level = 7
    expect(pro.level).toBe(7)
    expect(pro.internal).toBe(100)
  })

  it("fighterPowerBonus", () => {
    const expectFighterPower = makeExpect("fighterPowerBonus")

    expectFighterPower(0, "Fighter").toBe(0)
    expectFighterPower(99, "Fighter").toBe(Math.sqrt(99 / 10) + 14)
    expectFighterPower(100, "Fighter").toBe(Math.sqrt(100 / 10) + 22)

    expectFighterPower(99, "SeaplaneBomber").toBe(Math.sqrt(99 / 10) + 3)
    expectFighterPower(100, "SeaplaneBomber").toBe(Math.sqrt(100 / 10) + 6)

    expectFighterPower(100, "Other").toBe(Math.sqrt(100 / 10))
  })

  it("criticalPowerModifier", () => {
    const expectCriticalPower = makeExpect("criticalPowerModifier")

    expectCriticalPower(0, "Other").toBe(0)
    expectCriticalPower(99, "Other").toBe(Math.floor(Math.sqrt(99) + 7))
    expectCriticalPower(100, "Other").toBe(Math.floor(Math.sqrt(100) + 10))
  })
})
