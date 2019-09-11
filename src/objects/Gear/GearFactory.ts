import { MasterGear } from "../../data"

import Gear, { IGear } from "./Gear"
import Improvement from "./Improvement"
import Proficiency from "./Proficiency"

export interface IGearDataObject {
  masterId: number
  improvement?: number
  proficiency?: number
}

export default class GearFactory {
  constructor(private readonly masters: MasterGear[]) {}

  public create = (obj: IGearDataObject | undefined): IGear | undefined => {
    if (!obj) {
      return undefined
    }
    const master = this.masters.find(({ id }) => id === obj.masterId)
    if (!master) {
      return undefined
    }

    const improvement = new Improvement(obj.improvement, master)
    const proficiency = new Proficiency(obj.proficiency, master.category)
    const gear = new Gear(master, master.category, improvement, proficiency, master.hasAttr)

    return gear
  }
}
