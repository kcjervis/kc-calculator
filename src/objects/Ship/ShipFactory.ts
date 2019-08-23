import { MasterShip } from "../../data"
import { GearFactory, IGearDataObject } from "../Gear"
import { createPlanes } from "../Plane"

import { createExplicitStatsBonus } from "./ExplicitStatsBonus"
import Health from "./Health"
import Morale from "./Morale"
import Ship, { IShip } from "./Ship"
import ShipNakedStats, { IBaseStats } from "./ShipNakedStats"
import ShipStats from "./ShipStats"

export interface IShipDataObject {
  masterId: number
  level?: number
  slots?: number[]
  equipments?: Array<IGearDataObject | undefined>

  nowHp?: number
  morale?: number
  increased?: Partial<IBaseStats>
}

export default class ShipFactory {
  constructor(private readonly masters: MasterShip[], private readonly gearFactory: GearFactory) {}

  public create = (obj?: IShipDataObject): IShip | undefined => {
    if (!obj) {
      return undefined
    }

    const { masterId, level = 1, increased, morale: moraleValue } = obj
    const foundMaster = this.masters.find(master => master.id === masterId)
    if (!foundMaster) {
      return undefined
    }

    const gears = obj.equipments ? obj.equipments.map(this.gearFactory.create) : []

    const nakedStats = new ShipNakedStats(foundMaster, level, increased)
    const stats = new ShipStats(nakedStats, gears)

    const { nowHp = stats.hp } = obj
    const health = new Health(stats.hp, nowHp)
    const morale = new Morale(moraleValue)

    const slots = obj.slots ? obj.slots.concat() : foundMaster.slotCapacities.concat()

    const planes = createPlanes(slots, gears)
    const ship = new Ship(foundMaster, stats, nakedStats, health, morale, slots, gears, planes)

    // 装備ボーナスを適応
    ship.stats.statsBonus = createExplicitStatsBonus(ship)

    return ship
  }
}
