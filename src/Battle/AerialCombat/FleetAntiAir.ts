import { IGear, IFleet, IShip } from "../../objects"
import { BattleType, FleetRole } from "../../common"
import { Side } from "../../types"
import { sumBy } from "lodash-es"

export const gearFleetAntiAir = (gear: IGear) => {
  const { name, antiAir, improvement } = gear
  if (antiAir === 0) {
    return 0
  }

  let multiplier = 0
  if (gear.is("AntiAircraftFireDirector") || gear.is("HighAngleMount")) {
    multiplier = 0.35
  } else if (gear.is("AntiAircraftShell")) {
    multiplier = 0.6
  } else if (gear.is("Radar")) {
    multiplier = 0.4
  } else if (name === "46cm三連装砲") {
    multiplier = 0.25
  } else {
    multiplier = 0.2
  }
  return multiplier * antiAir + improvement.fleetAntiAirModifier
}

export const shipFleetAntiAir = (ship: IShip) => Math.floor(ship.totalEquipmentStats(gearFleetAntiAir))

export const calcFleetAntiAir = (fleet: IFleet, side: Side, formationModifier: number) => {
  const { totalShipStats } = fleet
  const totalShipFleetAntiAir = totalShipStats(shipFleetAntiAir)
  const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2

  if (side === "Player") {
    return postFloor / 1.3
  }
  return postFloor
}

export default class FleetAntiAir {
  public static getCombinedFleetModifier = (fleetRole: FleetRole, battleType: BattleType) => {
    if (fleetRole === FleetRole.EscortFleet) {
      return 0.48
    }
    if (battleType === BattleType.AirDefenseBattle) {
      return 0.72
    }
    return 0.8
  }

  public static calcFleetAntiAir = calcFleetAntiAir

  constructor(private ships: IShip[], private side: Side, private formationModifier: number) {}

  get fleetAntiAir() {
    const { ships, side, formationModifier } = this
    const totalShipFleetAntiAir = sumBy(ships, shipFleetAntiAir)
    const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2

    if (side === "Player") {
      return postFloor / 1.3
    }
    return postFloor
  }
}
