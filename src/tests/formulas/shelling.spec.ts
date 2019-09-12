import { getApShellModifiers, calcCruiserFitBonus } from "../../formulas/shelling"

describe("formulas/shelling", () => {
  it("getApShellModifiers", () => {
    const baseParams = { hasMainGun: false, hasArmorPiercingShell: false, hasSecondaryGun: false, hasRader: false }

    expect(getApShellModifiers(baseParams)).toEqual({ power: 1, accuracy: 1 })
    expect(getApShellModifiers({ ...baseParams, hasMainGun: true })).toEqual({ power: 1, accuracy: 1 })
    expect(getApShellModifiers({ ...baseParams, hasArmorPiercingShell: true })).toEqual({ power: 1, accuracy: 1 })

    expect(getApShellModifiers({ ...baseParams, hasMainGun: true, hasArmorPiercingShell: true })).toEqual({
      power: 1.08,
      accuracy: 1.1
    })

    expect(
      getApShellModifiers({ hasMainGun: true, hasArmorPiercingShell: true, hasSecondaryGun: true, hasRader: false })
    ).toEqual({ power: 1.15, accuracy: 1.2 })

    expect(
      getApShellModifiers({ hasMainGun: true, hasArmorPiercingShell: true, hasSecondaryGun: false, hasRader: true })
    ).toEqual({ power: 1.1, accuracy: 1.25 })

    expect(
      getApShellModifiers({ hasMainGun: true, hasArmorPiercingShell: true, hasSecondaryGun: true, hasRader: true })
    ).toEqual({ power: 1.15, accuracy: 1.3 })
  })

  it("calcCruiserFitBonus", () => {
    expect(
      calcCruiserFitBonus({
        isLightCruiserClass: false,
        singleGunCount: 4,
        twinGunCount: 4,
        isZaraClass: false,
        zaraGunCount: 4
      })
    ).toBe(0)

    expect(
      calcCruiserFitBonus({
        isLightCruiserClass: true,
        singleGunCount: 5,
        twinGunCount: 6,
        isZaraClass: false,
        zaraGunCount: 0
      })
    ).toBe(Math.sqrt(5) + 2 * Math.sqrt(6))

    expect(
      calcCruiserFitBonus({
        isLightCruiserClass: false,
        singleGunCount: 0,
        twinGunCount: 0,
        isZaraClass: true,
        zaraGunCount: 5
      })
    ).toBe(Math.sqrt(5))
  })
})
