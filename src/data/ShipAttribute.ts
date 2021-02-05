import { ShipClassId, ShipClassKey, ShipId } from "@jervis/data"
import { ShipBase } from "./MasterShip"

const or = <T>(...fs: Array<(arg: T) => boolean>) => (arg: T) => fs.some(f => f(arg))

export type ShipMatcher = (ship: ShipBase) => boolean

const makeShipClassMatcher = (...keys: ShipClassKey[]): ShipMatcher => ship =>
  keys.map(key => ShipClassId[key]).includes(ship.shipClassId)

const RoyalNavy = makeShipClassMatcher("QueenElizabethClass", "NelsonClass", "ArkRoyalClass", "JClass", "TownClass")
const UsNavy = makeShipClassMatcher(
  "JohnCButlerClass",
  "FletcherClass",
  "IowaClass",
  "LexingtonClass",
  "EssexClass",
  "CasablancaClass",
  "ColoradoClass",
  "NorthamptonClass",
  "AtlantaClass"
)
const SovietNavy = or(ship => ship.shipId === ShipId["Верный"], makeShipClassMatcher("TashkentClass", "GangutClass"))

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

const Unremodeled: ShipMatcher = ship => ship.sortId % 10 === 1
const Kai: ShipMatcher = ship => ship.name.endsWith("改")
const Kai2: ShipMatcher = ship => ship.sortId % 10 >= 6 && ship.sortId % 10 < 9

export const matchers = {
  RoyalNavy,
  UsNavy,
  SovietNavy,

  Installation,
  SoftSkinned,
  Pillbox,
  SupplyDepot,
  IsolatedIsland,

  Unremodeled,
  Kai,
  Kai2
}

type ShipAttribute = keyof typeof matchers
const matcherAttrs = Object.keys(matchers) as ShipAttribute[]

const ShipAttribute = {
  from: (ship: ShipBase) => matcherAttrs.filter(attr => matchers[attr](ship))
}

export default ShipAttribute
