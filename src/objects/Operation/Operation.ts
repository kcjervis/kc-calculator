import { FleetTypeName, Side } from "../../common"
import { IFleet } from "../fleet"
import { ILandBasedAirCorps } from "../landBasedAirCorps"
import { sumBy } from "lodash-es"

export interface IOperation {
  side: Side
  fleetType: FleetTypeName
  fleets: IFleet[]
  landBase: ILandBasedAirCorps[]

  mainFleet: IFleet
  escortFleet?: IFleet

  isCombinedFleetOperation: boolean

  getFighterPower: (isCombinedFleetCombat?: boolean) => number | undefined
  getInterceptionPower: (isCombinedFleetCombat?: boolean) => number | undefined
}

export default class Operation implements IOperation {
  constructor(
    public readonly side: Side,
    public readonly fleetType: FleetTypeName,
    public readonly fleets: IFleet[],
    public readonly landBase: ILandBasedAirCorps[]
  ) {}

  get isCombinedFleetOperation() {
    return this.fleetType !== FleetTypeName.Single
  }

  get mainFleet() {
    return this.fleets[0]
  }

  get escortFleet() {
    if (this.isCombinedFleetOperation) {
      return this.fleets[1]
    }
    return undefined
  }

  public getFighterPower = (includesEscort = false) => {
    const { mainFleet, escortFleet } = this
    if (mainFleet.hasUnknownSlot) {
      return undefined
    }

    if (!includesEscort || !escortFleet) {
      return mainFleet.fighterPower
    }

    if (escortFleet.hasUnknownSlot) {
      return undefined
    }

    return mainFleet.fighterPower + escortFleet.fighterPower
  }

  public getInterceptionPower = (includesEscort = false) => {
    const { mainFleet, escortFleet } = this

    if (mainFleet.hasUnknownSlot) {
      return undefined
    }

    const main = sumBy(mainFleet.planes, plane => plane.interceptionPower)

    if (!includesEscort || !escortFleet) {
      return main
    }

    if (escortFleet.hasUnknownSlot) {
      return undefined
    }

    return main + sumBy(escortFleet.planes, plane => plane.interceptionPower)
  }
}
