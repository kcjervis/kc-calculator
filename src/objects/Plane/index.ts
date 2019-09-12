import { IGear } from "../gear"
import Plane, { IPlane } from "./Plane"

export { Plane, IPlane }

// 航空機をどう扱うか迷ってる
export const createPlanes = (slots: number[], gears: Array<IGear | undefined>) => {
  const planes = new Array<IPlane>()
  slots.map((slotSize, index) => {
    const gear = gears[index]
    if (!slotSize || !gear || !gear.is("Aircraft")) {
      return
    }
    planes.push(new Plane(gear, slots, index))
  })

  return planes
}
