import { MasterShip } from '../../data'
import { EquipmentFactory, IEquipmentDataObject } from '../Equipment'
import { createPlanes } from '../Plane'

import { createExplicitStatsBonus } from './ExplicitStatsBonus'
import Health from './Health'
import Morale from './Morale'
import Ship, { IShip } from './Ship'
import ShipNakedStats, { IBaseStats } from './ShipNakedStats'
import ShipStats from './ShipStats'

export interface IShipDataObject {
  masterId: number
  level: number
  slots: number[]
  equipments: Array<IEquipmentDataObject | undefined>

  nowHp?: number
  morale?: number
  increased?: Partial<IBaseStats>
}

export default class ShipFactory {
  constructor(private readonly masters: MasterShip[], private readonly equipmentFactory: EquipmentFactory) {}

  public create = (obj?: IShipDataObject): IShip | undefined => {
    if (!obj) {
      return undefined
    }

    const { masterId, level, increased, equipments: equipObjs, morale: moraleValue } = obj
    const foundMaster = this.masters.find(master => master.id === masterId)
    if (!foundMaster) {
      return undefined
    }

    const equipments = equipObjs.map(this.equipmentFactory.create)

    const nakedStats = new ShipNakedStats(foundMaster, level, increased)
    const stats = new ShipStats(nakedStats, equipments)

    const { nowHp = stats.hp } = obj
    const health = new Health(stats.hp, nowHp)
    const morale = new Morale(moraleValue)

    const slots = obj.slots.concat()

    const planes = createPlanes(slots, equipments)
    const ship = new Ship(foundMaster, stats, nakedStats, health, morale, slots, equipments, planes)

    // 装備ボーナスを適応
    ship.stats.statsBonus = createExplicitStatsBonus(ship)

    return ship
  }
}
