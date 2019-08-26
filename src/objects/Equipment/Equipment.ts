import { ListIterator } from "lodash"
import { PickByValue } from "utility-types"
import { IGear } from "../Gear"
import { GearCategory, GearCategoryKey } from "../../data"
import { sumBy, map } from "lodash-es"
import { isNonNullable } from "../../utils"

type GearIteratee<R> = (gear: IGear, index?: GearIndex, slotSize?: number) => R

type IEquipment = {
  forEach: (iteratee: GearIteratee<void>) => void
  map: <T>(iteratee: GearIteratee<T>) => T[]

  count: (iteratee?: GearIteratee<boolean>) => number
  has: (iteratee: GearIteratee<boolean>) => boolean
}

const indexes = [0, 1, 2, 3, 4, 5, "exslot"] as const
type GearIndex = typeof indexes[number]

class Equipment implements IEquipment {
  private gears: IGear[]

  private entries: Array<[IGear, GearIndex, number | undefined]>

  constructor(private source: Array<IGear | undefined>, private slots: number[]) {
    this.gears = source.filter(isNonNullable)

    const entries = Array<[IGear, GearIndex, number | undefined]>()
    source.forEach((gear, index) => {
      if (!gear) {
        return
      }
      const key = index === slots.length ? "exslot" : (index as GearIndex)
      entries.push([gear, key, slots[index]])
    })

    this.entries = entries
  }

  public forEach = (callbackfn: GearIteratee<void>) => this.entries.forEach(item => callbackfn(...item))

  public map = <T>(callbackfn: GearIteratee<T>) => this.entries.map(item => callbackfn(...item))

  public count = (iteratee?: GearIteratee<boolean> | number) => {
    if (iteratee === undefined) {
      return this.gears.length
    }
    if (typeof iteratee === "number") {
      return this.gears.filter(({ masterId }) => masterId === iteratee).length
    }
    return this.entries.filter(item => iteratee(...item)).length
  }

  public has = (iteratee: GearIteratee<boolean> | number) => {
    return this.count(iteratee) > 0
  }

  public sumBy = (iteratee: ((gear: IGear) => number) | keyof PickByValue<IGear, number>) => {
    sumBy(this.gears, iteratee)
  }
}
