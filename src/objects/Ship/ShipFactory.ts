import { ShipMaster } from '../../data'
import { EquipmentFactory, IEquipmentDataObject } from '../Equipment'
import { IFleetInformation } from '../Fleet/FleetInformation'

import { createPlanes } from '../Plane'
import BaseShip from './BaseShip'
import { createExplicitStatsBonus } from './ExplicitStatsBonus'
import Ship, { IShip } from './Ship'
import ShipAerialCombat from './ShipAerialCombat'
import ShipNakedStats, { IBaseStats } from './ShipNakedStats'
import ShipStats from './ShipStats'

export interface IShipDataObject {
  masterId: number
  level: number
  equipments: Array<IEquipmentDataObject | undefined>
  slots?: number[]
  increased?: Partial<IBaseStats>
}

export default class ShipFactory {
  constructor(private readonly masters: ShipMaster[], private readonly equipmentFactory: EquipmentFactory) {}

  public create(obj: IShipDataObject, fleetInformation: IFleetInformation): IShip | undefined {
    const { masterId, level, increased, equipments: equipObjs } = obj
    const foundMaster = this.masters.find(master => master.id === masterId)
    if (!foundMaster) {
      return undefined
    }

    const equipmentCollection = this.equipmentFactory.createCollection(equipObjs)

    const nakedStats = new ShipNakedStats(foundMaster, level, increased)
    const stats = new ShipStats(nakedStats, equipmentCollection)
    const baseShip = new BaseShip(foundMaster, fleetInformation, stats, nakedStats, equipmentCollection)

    // 装備ボーナスを適応
    baseShip.stats.statsBonus = createExplicitStatsBonus(baseShip)

    const aerialCombat = new ShipAerialCombat(baseShip)

    const planes = createPlanes(baseShip.slots, equipmentCollection.list)

    return new Ship(baseShip, planes, aerialCombat)
  }
}
