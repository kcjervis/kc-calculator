import { calcBasicPower } from "./asw"

describe("asw", () => {
  it("calcBasicPower", () => {
    expect(calcBasicPower({ nakedAsw: 90, equipmentAsw: 12, improvementModifier: 3, typeConstant: 13 })).toBe(
      Math.sqrt(90) * 2 + 12 * 1.5 + 3 + 13
    )
  })
})
