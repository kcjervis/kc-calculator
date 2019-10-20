import { MasterGear } from "../../data"

import Gear, { IGear } from "./Gear"
import Improvement from "./Improvement"
import Proficiency, { ProficiencyType } from "./Proficiency"

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

    const proficiencyType = ProficiencyType.from(master.attrs)

    const improvement = new Improvement(obj.improvement, master, master.is)
    const proficiency = new Proficiency(obj.proficiency, proficiencyType)
    const gear = new Gear(master, master.category, improvement, proficiency, master.attrs)

    return gear
  }
}
