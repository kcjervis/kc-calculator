import {
  api_mst_slotitem,
  improvableIds,
  ships as defaultShipsData,
  ShipName,
  GearId,
  GearName,
  ShipId
} from "@jervis/data"

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
  public findMasterGear = (gearId: number) => {
    return this.gears.find(gear => gear.id === gearId)
  }

  /**
   * 艦娘マスターデータを探す
   */
  public findMasterShip = (shipId: number) => {
    return this.ships.find(ship => ship.shipId === shipId)
  }

  public shipIdToName = (shipId: ShipId) => {
    const found = this.ships.find(ship => ship.shipId === shipId)
    return found ? found.name : ""
  }
  public shipNameToId = (name: string) => {
    const found = this.ships.find(ship => ship.name === name)
    return found ? found.shipId : 0
  }

  public shipClassIdToName = (id: number) => ShipClass.fromId(id).name
  public shipTypeIdToName = (id: number) => ShipType.fromId(id).name

  public gearIdToName = (gearId: GearId) => {
    const found = this.findMasterGear(gearId)
    return found ? (found.name as GearName) : ""
  }
  public gearNameToId = (name: string) => {
    const found = this.gears.find(gear => gear.name === name)
    return found && found.id
  }
}
