import ShipAttribute, { ShipMatcher, matchers } from "../../data/ShipAttribute"
import { createStubbedShipBase } from "../testUtils"
import { ShipClassId } from "@jervis/data"
import { ShipBase } from "../../data/MasterShip"

const matcherTest = (matcher: ShipMatcher, stats: Partial<ShipBase>) => {
  const stub = createStubbedShipBase(stats)
  return expect(matcher(stub))
}

describe("ShipAttribute", () => {
  it("Installation", () => {
    matcherTest(matchers.Installation, { speed: 0 }).toBe(true)
    matcherTest(matchers.Installation, { speed: 5 }).toBe(false)
  })

  it("SoftSkinned", () => {
    const softSkinnedShips = [
      ShipClassId.AirfieldPrincess,
      ShipClassId.NorthernPrincess,
      ShipClassId.HarbourPrincess,
      ShipClassId.SupplyDepotPrincess,
      ShipClassId.SupplyDepotSummerPrincess
    ]
    softSkinnedShips.forEach(shipClassId => matcherTest(matchers.SoftSkinned, { shipClassId }).toBe(true))

    matcherTest(matchers.SoftSkinned, { shipClassId: ShipClassId.HarbourSummerPrincess }).toBe(false)
  })

  it("Pillbox", () => {
    matcherTest(matchers.Pillbox, { shipClassId: ShipClassId.ArtilleryImp }).toBe(true)
    matcherTest(matchers.Pillbox, {}).toBe(false)
  })

  it("IsolatedIsland", () => {
    const isolatedIslands = [ShipClassId.IsolatedIslandDemon, ShipClassId.IsolatedIslandPrincess]
    isolatedIslands.forEach(shipClassId => matcherTest(matchers.IsolatedIsland, { shipClassId }).toBe(true))
    matcherTest(matchers.IsolatedIsland, {}).toBe(false)
  })

  it("SupplyDepot", () => {
    const supplyDepots = [ShipClassId.SupplyDepotPrincess, ShipClassId.SupplyDepotSummerPrincess]
    supplyDepots.forEach(shipClassId => matcherTest(matchers.SupplyDepot, { shipClassId }).toBe(true))
    matcherTest(matchers.SupplyDepot, {}).toBe(false)
  })
})
