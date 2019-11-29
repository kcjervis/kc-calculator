import AswAttack, { getAswType } from "./AswAttack"
import { makeShip } from "../data/EquipmentBonus.spec"

describe("AswAttack", () => {
  it("getAswType", () => {
    const attacker = makeShip("綾波")
    const defender = makeShip("潜水カ級")
    expect(getAswType(attacker)).toBe("DepthCharge")
  })
  it("isPossible", () => {
    const attacker = makeShip("綾波")
    const defender = makeShip("潜水カ級")
    expect(AswAttack.isPossible(attacker, defender)).toBe(true)
  })
})
