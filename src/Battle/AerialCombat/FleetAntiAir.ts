import { IEquipment, IFleet, IShip } from '../../objects'
import { BattleType, FleetRole, Side } from '../../constants'
import { sumBy } from 'lodash-es'

export const equipmentFleetAntiAir = (equipment: IEquipment) => {
  const { name, antiAir, category, isHighAngleMount, improvement } = equipment
  if (antiAir === 0) {
    return 0
  }

  let multiplier = 0
  if (category.is('AntiAircraftFireDirector') || isHighAngleMount) {
    multiplier = 0.35
  } else if (category.is('AntiAircraftShell')) {
    multiplier = 0.6
  } else if (category.isRadar) {
    multiplier = 0.4
  } else if (name === '46cm三連装砲') {
    multiplier = 0.25
  } else {
    multiplier = 0.2
  }
  return multiplier * antiAir + improvement.fleetAntiAirModifier
}

export const shipFleetAntiAir = (ship: IShip) => Math.floor(ship.totalEquipmentStats(equipmentFleetAntiAir))

export const calcFleetAntiAir = (fleet: IFleet, side: Side, formationModifier: number) => {
  const { totalShipStats } = fleet
  const totalShipFleetAntiAir = totalShipStats(shipFleetAntiAir)
  const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2

  if (side === Side.Player) {
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

  constructor(
    private ships: IShip[],
    private side: Side,
    private formationModifier: number,
    private battleType: BattleType,
    private fleetRole: FleetRole
  ) {}

  get combinedFleetModifier() {
    const { fleetRole, battleType } = this
    if (fleetRole === FleetRole.EscortFleet) {
      return 0.48
    }
    if (battleType === BattleType.AirDefenseBattle) {
      return 0.72
    }
    return 0.8
  }

  get fleetAntiAir() {
    const { ships, side, formationModifier } = this
    const totalShipFleetAntiAir = sumBy(ships, shipFleetAntiAir)
    const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2

    if (side === Side.Player) {
      return postFloor / 1.3
    }
    return postFloor
  }
}
