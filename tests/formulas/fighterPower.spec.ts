import { calcFighterPower } from "../../src/formulas"

describe("formulas/fighterPower", () => {
  it("calcFighterPower", () => {
    expect(calcFighterPower({ slotSize: 2, antiAir: 2 })).toBe(2)
    expect(calcFighterPower({ slotSize: 3, antiAir: 2 })).toBe(3)

    expect(calcFighterPower({ slotSize: 3, antiAir: 2, improvementModifier: 1 })).toBe(5)
    expect(calcFighterPower({ slotSize: 3, antiAir: 2, proficiencyModifier: 1 })).toBe(4)

    expect(calcFighterPower({ slotSize: 4, antiAir: 0, interception: 2 })).toBe(6)
    expect(calcFighterPower({ slotSize: 4, antiAir: 0, antiBomber: 2 })).toBe(0)

    expect(calcFighterPower({ slotSize: 4, antiAir: 0, antiBomber: 2, isInterception: true })).toBe(8)
    expect(calcFighterPower({ slotSize: 4, antiAir: 0, interception: 2, isInterception: true })).toBe(4)
  })
})
