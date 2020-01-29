import { IPlane } from "../objects"
import { AirControlState } from "../common"
import { sumBy } from "lodash-es"

const calcTriggerRate = (totalTriggerFactor: number, airStateModifier: number) => {
  if (airStateModifier === 0) {
    return 0
  }

  return Math.min((totalTriggerFactor + 1) / (70 - 15 * airStateModifier), 1)
}

export default class Contact {
  constructor(private planes: IPlane[]) {}

  public calcRate = (airState: AirControlState) => {
    const { planes } = this
    const airStateModifier = airState.contactMultiplier

    const totalTriggerFactor = sumBy(
      planes.filter(plane => plane.is("ReconnaissanceAircraft")),
      plane => plane.contactTriggerFactor
    )

    const triggerRate = calcTriggerRate(totalTriggerFactor, airStateModifier)

    const selectionRateMap = {
      [1.2]: 0,
      [1.17]: 0,
      [1.12]: 0
    }
    const selectionRate = planes
      .filter(plane => plane.canContact)
      .sort((plane1, plane2) => plane2.gear.accuracy - plane1.gear.accuracy)
      .reduce((acc, plane) => {
        const curRate = (1 - acc) * plane.contactSelectionRate(airState)
        const { accuracy } = plane.gear
        if (accuracy >= 3) {
          selectionRateMap[1.2] += curRate
        } else if (accuracy === 2) {
          selectionRateMap[1.17] += curRate
        } else {
          selectionRateMap[1.12] += curRate
        }
        return acc + curRate
      }, 0)

    const successRate = triggerRate * selectionRate

    const rateMap = {
      [1.2]: selectionRateMap[1.2] * triggerRate,
      [1.17]: selectionRateMap[1.17] * triggerRate,
      [1.12]: selectionRateMap[1.12] * triggerRate
    }

    return {
      successRate,
      triggerRate,
      selectionRateMap,
      rateMap
    }
  }

  public getContactModifier = (airState: AirControlState) => {
    if (airState.contactMultiplier === 0) {
      return 1
    }

    const { rateMap } = this.calcRate(airState)
    const randomNum = Math.random()

    if (randomNum < rateMap[1.2]) {
      return 1.2
    }

    if (randomNum < rateMap[1.2] + rateMap[1.17]) {
      return 1.17
    }

    if (randomNum < rateMap[1.2] + rateMap[1.17] + rateMap[1.12]) {
      return 1.12
    }

    return 1
  }
}
