import { flatMap, sumBy } from "lodash-es"

import EffectiveLos from "../../EffectiveLos"
import { isNonNullable } from "../../utils"
import { IPlane } from "../plane"
import { IShip } from "../ship"
import { ShipType, ShipTypeId } from "../../data"
import { GearId, ShipId } from "@jervis/data"
import { IGear } from "../gear"
import { calcExpeditionBonus } from "../../expedition"

type ShipIterator<R> = (ship: IShip) => R

export interface IFleet {
  ships: Array<IShip | undefined>
  nonNullableShips: IShip[]
  planes: IPlane[]

  hasUnknownSlot: boolean

  totalShipStats: (iteratee: ShipIterator<number>) => number

  fighterPower: number
  effectiveLos: (nodeDivaricatedFactor: number, hqLevel: number) => number
  aviationDetectionScore: number
}

const shipTypeToTp = (shipType: ShipTypeId) => {
  switch (shipType) {
    case ShipTypeId.SubmarineAircraftCarrier:
      return 1
    case ShipTypeId.Destroyer:
      return 5
    case ShipTypeId.LightCruiser:
      return 2
    case ShipTypeId.AviationCruiser:
      return 4
    case ShipTypeId.AviationBattleship:
      return 7
    case ShipTypeId.FleetOiler:
      return 12
    case ShipTypeId.AmphibiousAssaultShip:
      return 12
    case ShipTypeId.SeaplaneTender:
      return 9
    case ShipTypeId.SubmarineTender:
      return 7
    case ShipTypeId.TrainingCruiser:
      return 6
  }
  return 0
}

const gearToTp = (gear: IGear) => {
  if (gear.category.is("LandingCraft")) {
    return 8
  }

  if (gear.category.is("CombatRation")) {
    return 1
  }

  switch (gear.gearId) {
    case GearId["ドラム缶(輸送用)"]:
      return 5
    case GearId["特二式内火艇"]:
      return 2
  }

  return 0
}

const shipToTp = (ship: IShip) => {
  const equipmentTp = ship.totalEquipmentStats(gearToTp)
  const shipTypeTp = shipTypeToTp(ship.shipTypeId)
  const shipBonus = ship.shipId === ShipId["鬼怒改二"] ? 8 : 0
  return equipmentTp + shipTypeTp + shipBonus
}

export default class Fleet implements IFleet {
  constructor(public readonly ships: Array<IShip | undefined>) {}

  get nonNullableShips() {
    return this.ships.filter(isNonNullable)
  }

  public totalShipStats = (iteratee: ShipIterator<number>) => {
    return sumBy(this.nonNullableShips, iteratee)
  }

  get planes() {
    return flatMap(this.nonNullableShips, ship => ship.planes)
  }

  get hasUnknownSlot() {
    return this.nonNullableShips.flatMap(ship => ship.slots).some(slot => slot < 0)
  }

  get fighterPower() {
    return sumBy(
      this.planes.filter(plane => !plane.is("ReconnaissanceAircraft")),
      "fighterPower"
    )
  }

  get tp() {
    return sumBy(this.nonNullableShips, shipToTp)
  }

  get expeditionBonus() {
    return calcExpeditionBonus(this.nonNullableShips)
  }

  public effectiveLos = (nodeDivaricatedFactor: number, hqLevel: number): number => {
    return EffectiveLos.calcFleetEffectiveLos(this, nodeDivaricatedFactor, hqLevel)
  }

  get aviationDetectionScore() {
    return sumBy(this.planes, plane => {
      if (plane.is("LargeFlyingBoat")) {
        return plane.gear.los * Math.sqrt(plane.slotSize)
      }

      if (plane.is("ReconnaissanceSeaplane") || plane.is("SeaplaneBomber")) {
        return plane.gear.los * Math.sqrt(Math.sqrt(plane.slotSize))
      }

      return 0
    })
  }
}
