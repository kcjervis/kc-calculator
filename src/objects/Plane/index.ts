import { IEquipment } from '../Equipment'
import Plane, { IPlane } from './Plane'

export { Plane, IPlane }

// 航空機をどう扱うか迷ってる
export const createPlanes = (slots: number[], equipments: Array<IEquipment | undefined>) => {
  const planes = new Array<IPlane>()
  slots.map((slotSize, index) => {
    const equip = equipments[index]
    if (!slotSize || !equip || !equip.category.isAerialCombatAircraft) {
      return
    }
    planes.push(new Plane(equip, slots, index))
  })

  return planes
}
