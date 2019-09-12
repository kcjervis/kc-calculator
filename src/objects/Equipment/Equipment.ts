import { sumBy } from "lodash-es"
import { isNonNullable, isMatch, Condition } from "../../utils"
import { PickByValue } from "utility-types"

type GearIteratee<GearType, R> = (gear: GearType, index?: GearIndex, slotSize?: number) => R

type IEquipment<GearType> = {
  forEach: (iteratee: GearIteratee<GearType, void>) => void
  map: <T>(iteratee: GearIteratee<GearType, T>) => T[]

  count: (iteratee?: GearIteratee<GearType, boolean>) => number
  has: (iteratee: GearIteratee<GearType, boolean>) => boolean
}

const indexes = [0, 1, 2, 3, 4, 5, "exslot"] as const
type GearIndex = typeof indexes[number]

export class Equipment<GearType extends { masterId: number }> implements IEquipment<GearType> {
  private gears: GearType[]

  private entries: Array<[GearType, GearIndex, number | undefined]>

  constructor(private source: Array<GearType | undefined>, private slots: number[]) {
    this.gears = source.filter(isNonNullable)

    const entries = Array<[GearType, GearIndex, number | undefined]>()
    source.forEach((gear, index) => {
      if (!gear) {
        return
      }
      const key = index === slots.length ? "exslot" : (index as GearIndex)
      entries.push([gear, key, slots[index]])
    })

    this.entries = entries
  }

  public forEach = (callbackfn: GearIteratee<GearType, void>) => this.entries.forEach(item => callbackfn(...item))

  public map = <T>(callbackfn: GearIteratee<GearType, T>) => this.entries.map(item => callbackfn(...item))

  public count = (iteratee?: GearIteratee<GearType, boolean> | number) => {
    if (iteratee === undefined) {
      return this.gears.length
    }
    if (typeof iteratee === "function") {
      return this.entries.filter(item => iteratee(...item)).length
    }

    return this.gears.filter(({ masterId }) => masterId === iteratee).length
  }

  public has = (iteratee: GearIteratee<GearType, boolean> | number) => {
    return this.count(iteratee) > 0
  }

  public sumBy = (iteratee: ((gear: GearType) => number) | keyof PickByValue<GearType, number> & string) => {
    return sumBy(this.gears, iteratee)
  }
}
