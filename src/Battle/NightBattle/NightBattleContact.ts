import { flatMap, random } from "lodash-es"

import { AirControlState } from "../../constants"
import { IPlane, IShip } from "../../objects"

const isNightRecon = (plane: IPlane) => plane.slotSize > 0 && plane.gear.name.includes("夜偵")

const shipToNightCombatContactPlane = (ship: IShip) =>
  ship.planes.filter(isNightRecon).filter(plane => Math.floor(plane.gear.los * Math.sqrt(ship.level)) > random(24))

const getNightCombatContactPlane = (ships: IShip[], airControlState: AirControlState) => {
  if (airControlState.contactMultiplier === 0) {
    return undefined
  }

  const contactPlanes = flatMap(ships, shipToNightCombatContactPlane)
  if (contactPlanes.length === 0) {
    return undefined
  }

  return contactPlanes[0]
}

export { getNightCombatContactPlane }
