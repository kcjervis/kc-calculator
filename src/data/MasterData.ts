import { api_mst_slotitem, improvableIds, ships as defaultShipsData } from "@jervis/data"

import GearCategory from "./GearCategory"
import MasterGear from "./MasterGear"
import MasterShip from "./MasterShip"
import ShipClass from "./ShipClass"
import ShipType from "./ShipType"

/**
 * マスターデータ
 */
export default class MasterData {
  /** 装備リスト */
  public readonly gears: MasterGear[]

  /** 艦娘リスト */
  public readonly ships: MasterShip[]

  constructor(public readonly shipsData = defaultShipsData) {
    this.gears = api_mst_slotitem.map(raw => {
      const id = raw.api_id
      const categoryId = raw.api_type[2]

      const gearCategory = GearCategory.find(categoryId, id)
      const improvable = improvableIds.includes(id)
      return new MasterGear(raw, gearCategory, improvable)
    })

    this.ships = shipsData.map(shipData => {
      const shipType = ShipType.fromId(shipData.shipTypeId)
      const shipClass = ShipClass.fromId(shipData.classId)
      return new MasterShip(shipData, shipType, shipClass)
    })
  }

  /**
   * 装備マスターデータを探す
   */
  public findMasterGear(masterId: number) {
    return this.gears.find(gear => gear.id === masterId)
  }

  /**
   * 艦娘マスターデータを探す
   */
  public findMasterShip(masterId: number) {
    return this.ships.find(ship => ship.id === masterId)
  }
}
