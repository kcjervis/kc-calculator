import { FleetRole, FleetTypeName, Formation, Side } from "../constants"
import { IFleet, ILandBasedAirCorps, IShip } from "../objects"
import { FleetAntiAir } from "./AerialCombat"

export interface IShipBattleInformation {
  side: Side
  fleetType: FleetTypeName
  fleetRole: FleetRole
  fleetAntiAir: number

  formation: Formation
}

export interface IBattleFleet {
  name: string

  side: Side
  fleetType: FleetTypeName
  formation: Formation

  landBase: ILandBasedAirCorps[]
  mainFleet: IFleet
  escortFleet?: IFleet

  allShips: IShip[]

  fleetAntiAir: number
  isCombinedFleet: boolean

  getShipInformation: (ship: IShip) => IShipBattleInformation | undefined
}

export default class BattleFleet implements IBattleFleet {
  public formation: Formation = Formation.LineAhead

  public name = ""

  constructor(
    public readonly side: Side,
    public readonly fleetType: FleetTypeName,
    public readonly landBase: ILandBasedAirCorps[],
    public readonly mainFleet: IFleet,
    public readonly escortFleet?: IFleet
  ) {
    if (this.isCombinedFleet) {
      this.formation = Formation.CruisingFormation4
    }
  }

  get allShips() {
    const { mainFleet, escortFleet } = this
    const ships = mainFleet.nonNullableShips.concat()
    if (!escortFleet) {
      return ships
    }

    return ships.concat(escortFleet.nonNullableShips)
  }

  get fleetAntiAir() {
    const { allShips, side, formation } = this
    const fleetAntiAir = new FleetAntiAir(allShips, side, formation.fleetAntiAirModifier)
    return fleetAntiAir.fleetAntiAir
  }

  get isCombinedFleet() {
    return this.fleetType !== FleetTypeName.Single
  }

  public getShipInformation(ship: IShip) {
    const { mainFleet, escortFleet, side, fleetType, fleetAntiAir, formation } = this
    const baseInfo = { side, fleetType, fleetAntiAir, formation }
    const mainFleetShip = mainFleet.nonNullableShips.find(fleetShip => fleetShip === ship)
    if (mainFleetShip) {
      return { ...baseInfo, fleetRole: FleetRole.MainFleet }
    }

    if (!escortFleet) {
      return undefined
    }
    const escortFleetShip = escortFleet.nonNullableShips.find(fleetShip => fleetShip === ship)
    if (escortFleetShip) {
      return { ...baseInfo, fleetRole: FleetRole.EscortFleet }
    }
    return undefined
  }
}
