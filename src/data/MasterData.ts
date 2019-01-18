import defaultRawMstData from '@kancolle/data'
import improvements from '../../data/improvements.json'
import defaultShipsData from '../../data/ships.json'

import EquipmentCategory from './EquipmentCategory'
import MasterEquipment from './MasterEquipment'
import MasterShip from './MasterShip'
import ShipClass from './ShipClass'
import ShipType from './ShipType'

/**
 * マスターデータ
 */
export default class MasterData {
  /** 装備リスト */
  public readonly equipments: MasterEquipment[]

  /** 艦娘リスト */
  public readonly ships: MasterShip[]

  constructor(public readonly rawData = defaultRawMstData, public readonly shipsData = defaultShipsData) {
    this.equipments = rawData.api_mst_slotitem.map(raw => {
      const equipmentCategory = EquipmentCategory.fromId(raw.api_type[2])
      const improvable = improvements.includes(raw.api_id)
      return new MasterEquipment(raw, equipmentCategory, improvable)
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
  public findMasterEquipment(masterId: number) {
    return this.equipments.find(equip => equip.id === masterId)
  }

  /**
   * 艦娘マスターデータを探す
   */
  public findMasterShip(masterId: number) {
    return this.ships.find(ship => ship.id === masterId)
  }
}
