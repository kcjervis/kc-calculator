import defaultRawMstData from '@kancolle/data'
import defaultShipsData from '../../ships.json'

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
      return new MasterEquipment(equipmentData, equipmentCategory)
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
