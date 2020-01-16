import { AirControlState } from "../common"

describe("AirControlState", () => {
  it("getBoundaryValues", () => {
    expect(AirControlState.getBoundaryValues(7)).toMatchObject({
      AirSupremacy: 21,
      AirSuperiority: 11,
      AirParity: 5,
      AirDenial: 3
    })
    expect(AirControlState.getBoundaryValues(30)).toMatchObject({
      AirSupremacy: 90,
      AirSuperiority: 45,
      AirParity: 21,
      AirDenial: 11
    })
  })

  it("fromFighterPower", () => {
    expect(AirControlState.fromFighterPower(90, 30)).toBe(AirControlState.AirSupremacy)
    expect(AirControlState.fromFighterPower(89, 30)).toBe(AirControlState.AirSuperiority)

    expect(AirControlState.fromFighterPower(45, 30)).toBe(AirControlState.AirSuperiority)
    expect(AirControlState.fromFighterPower(44, 30)).toBe(AirControlState.AirParity)

    expect(AirControlState.fromFighterPower(21, 30)).toBe(AirControlState.AirParity)
    expect(AirControlState.fromFighterPower(20, 30)).toBe(AirControlState.AirDenial)

    expect(AirControlState.fromFighterPower(11, 30)).toBe(AirControlState.AirDenial)
    expect(AirControlState.fromFighterPower(10, 30)).toBe(AirControlState.AirIncapability)
  })
})
