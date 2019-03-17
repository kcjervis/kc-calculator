import { FleetRole, FleetType, Formation, Side } from '../constants'
import { IFleet, ILandBasedAirCorps, IPlane, IShip } from '../objects'

export interface IShipBattleInformation {
  side: Side
  fleetType: FleetType
  fleetRole: FleetRole
  fleetAntiAir: number

  formation: Formation
}

export interface IBattleFleet {
  side: Side
  fleetType: FleetType
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

  constructor(
    public readonly side: Side,
    public readonly fleetType: FleetType,
    public readonly landBase: ILandBasedAirCorps[],
    public readonly mainFleet: IFleet,
    public readonly escortFleet?: IFleet
  ) {}

  get fleetAntiAir() {
    return 1
  }

  get allShips() {
    const { mainFleet, escortFleet } = this
    const ships = mainFleet.nonNullableShips.concat()
    if (!escortFleet) {
      return ships
    }

    return ships.concat(escortFleet.nonNullableShips)
  }

  get isCombinedFleet() {
    return Boolean(this.escortFleet)
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
