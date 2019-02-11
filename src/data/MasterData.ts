import { api_mst_slotitem, improvements, ships as defaultShipsData } from '../../data'

import EquipmentCategory from './EquipmentCategory'
import EquipmentCategoryId from './EquipmentCategoryId'
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

  constructor(public readonly shipsData = defaultShipsData) {
    this.equipments = api_mst_slotitem.map(raw => {
      const masterId = raw.api_id
      let categoryId = raw.api_type[2]

      if (masterId === 128 || masterId === 281) {
        // 試製51cm連装砲 51cm連装砲
        categoryId = EquipmentCategoryId.LargeCaliberMainGun2
      } else if (masterId === 142) {
        // 15m二重測距儀＋21号電探改二
        categoryId = EquipmentCategoryId.LargeRadar2
      } else if (masterId === 151) {
        // 試製景雲(艦偵型)
        categoryId = EquipmentCategoryId.CarrierBasedReconnaissanceAircraft2
      }
      const equipmentCategory = EquipmentCategory.fromId(categoryId)
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
