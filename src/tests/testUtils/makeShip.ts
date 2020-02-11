import { ShipName, GearName } from "@jervis/data"
import { ObjectFactory, IGearDataObject, IShip, MasterData } from "../../index"

const data = new MasterData()
const factory = new ObjectFactory(data)

type GearState = GearName | { name: GearName; star?: number }

const toGearData = (state: GearState): IGearDataObject => {
  if (typeof state === "string") {
    state = { name: state }
  }
  const { name, star } = state
  const id = data.gearNameToId(name)
  if (!id) {
    throw Error(`${name} is not found`)
  }
  return { masterId: id, improvement: star }
}

const toShipId = (name: ShipName) => {
  const shipId = data.shipNameToId(name)
  if (!shipId) {
    throw Error(`${name} is not found`)
  }
  return shipId
}

export const makeShip = (shipName: ShipName, ...gears: GearState[]) => {
  const shipId = toShipId(shipName)
  const ship = factory.createShip({ masterId: shipId, equipments: gears.map(toGearData) })
  if (!ship) {
    throw Error(`${shipId} is not found`)
  }
  return ship
}
