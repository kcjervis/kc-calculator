import defaultRawMstData from '@kancolle/data'
import defaultShipsData from './ships'

import EquipmentCategory from './EquipmentCategory'
import EquipmentMaster from './EquipmentMaster'
import ShipClass from './ShipClass'
import ShipMaster from './ShipMaster'
import ShipType from './ShipType'

/**
 *
 */
export default class MasterData {
  /** 装備カテゴリ */
  public readonly EquipmentCategory = EquipmentCategory.all

  /** 装備リスト */
  public readonly equipments: EquipmentMaster[]

  /** 艦種 */
  public readonly ShipType = ShipType.all

  /** 艦娘リスト */
  public readonly ships: ShipMaster[]

  constructor(public readonly rawData = defaultRawMstData, public readonly shipsData = defaultShipsData) {
    this.equipments = rawData.api_mst_slotitem.map(raw => {
      const equipmentData = {
        id: raw.api_id,
        name: raw.api_name,
        typeIds: raw.api_type,
        hp: raw.api_taik,
        armor: raw.api_souk,
        firepower: raw.api_houg,
        torpedo: raw.api_raig,
        speed: raw.api_soku,
        bombing: raw.api_baku,
        antiAir: raw.api_tyku,
        asw: raw.api_tais,
        accuracy: raw.api_houm,
        evasion: raw.api_houk,
        los: raw.api_saku,
        luck: raw.api_luck,
        range: raw.api_leng,
        radius: raw.api_distance
      }
      const equipmentCategory = EquipmentCategory.fromId(raw.api_type[2])
      return new EquipmentMaster(equipmentData, equipmentCategory)
    })

    this.ships = shipsData.map(shipData => {
      const shipType = ShipType.fromId(shipData.shipTypeId)
      const shipClass = ShipClass.fromId(shipData.classId)
      return new ShipMaster(shipData, shipType, shipClass)
    })
  }

  /**
   * 装備マスターデータを探す
   */
  public findEquipmentMaster(masterId: number) {
    return this.equipments.find(equip => equip.id === masterId)
  }

  /**
   * 艦娘マスターデータを探す
   */
  public findShipMaster(masterId: number) {
    return this.ships.find(ship => ship.id === masterId)
  }
}
