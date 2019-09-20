import { ShipClassId, ShipClassKey } from "@jervis/data"
import { ShipBase } from "./MasterShip"

const or = <T>(...fs: Array<(arg: T) => boolean>) => (arg: T) => fs.some(f => f(arg))

export type ShipMatcher = (ship: ShipBase) => boolean

const makeShipClassMatcher = (...keys: ShipClassKey[]): ShipMatcher => ship =>
  keys.map(key => ShipClassId[key]).includes(ship.shipClassId)

const Installation: ShipMatcher = ship => ship.speed === 0

const SoftSkinned = makeShipClassMatcher(
  "AirfieldPrincess",
  "NorthernPrincess",
  "HarbourPrincess",
  "SupplyDepotPrincess",
  "SupplyDepotSummerPrincess"
)
const Pillbox = makeShipClassMatcher("ArtilleryImp")
const IsolatedIsland = makeShipClassMatcher("IsolatedIslandDemon", "IsolatedIslandPrincess")
const SupplyDepot = makeShipClassMatcher("SupplyDepotPrincess", "SupplyDepotSummerPrincess")

export const matchers = {
  Installation,
  SoftSkinned,
  Pillbox,
  SupplyDepot,
  IsolatedIsland
}

type ShipAttribute = keyof typeof matchers
const matcherAttrs = Object.keys(matchers) as ShipAttribute[]

const ShipAttribute = {
  from: (ship: ShipBase) => matcherAttrs.filter(attr => matchers[attr](ship))
}

export default ShipAttribute
