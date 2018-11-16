declare module '@kancolle/data' {
  export type TStatTuple = [number, number]

  type TMstSlotCapacity = [number, number, number, number, number]

  type TMstMaterials = [number, number, number, number]

  type TEquipmentTypeIds = [number, number, number, number, number]

  export type TMstAbysallShip = {
    "api_id": number,
    "api_sort_id": number,
    "api_name": string,
    "api_yomi": string,
    "api_stype": number,
    "api_ctype": number,
    "api_soku": number,
    "api_slot_num": number
  }

  export type TMstAllyShip = {
    "api_id": number,
    "api_sortno": number,
    "api_sort_id": number,
    "api_name": string,
    "api_yomi": string,
    "api_stype": number,
    "api_ctype": number,
    "api_afterlv": number,
    "api_aftershipid": string,
    /** 耐久 */
    "api_taik": TStatTuple,
    /** 装甲 */
    "api_souk": TStatTuple,
    /** 火力 */
    "api_houg": TStatTuple,
    "api_raig": TStatTuple,
    /** 対空 */
    "api_tyku": TStatTuple,
    /** 護衛空母のみ存在 */
    "api_tais"?: [number],
    "api_luck": TStatTuple,
    "api_soku": number,
    "api_leng": number,
    "api_slot_num": number,
    "api_maxeq": TMstSlotCapacity,
    "api_buildtime": number,
    "api_broken": TMstMaterials,
    "api_powup": TMstMaterials,
    "api_backs": number,
    "api_getmes": string,
    "api_afterfuel": number,
    "api_afterbull": number,
    "api_fuel_max": number,
    "api_bull_max": number,
    "api_voicef": number
  }

  export type TMstShip = TMstAbysallShip | TMstAllyShip

  type TMstEquipmentCategory = {
    "api_id": number,
    "api_name": string,
    "api_show_flg": number
  }

  type TMstReinforceExpansionShip = {
    "api_slotitem_id": number,
    "api_ship_ids": number[]
  }

  type TMstShipType = {
    "api_id": number,
    "api_sortno": number,
    "api_name": string,
    "api_scnt": number,
    "api_kcnt": number,
    "api_equip_type": {
      [K: string]: number
    }
  }

  type TMstEquipment = {
    "api_id": number,
    "api_sortno": number,
    "api_name": string,
    "api_type": TEquipmentTypeIds,
    "api_taik": number,
    "api_souk": number,
    "api_houg": number,
    "api_raig": number,
    "api_soku": number,
    "api_baku": number,
    "api_tyku": number,
    "api_tais": number,
    "api_atap": number,
    "api_houm": number,
    "api_raim": number,
    "api_houk": number,
    "api_raik": number,
    "api_bakk": number,
    "api_saku": number,
    "api_sakb": number,
    "api_luck": number,
    "api_leng": number,
    "api_cost ": number,
    "api_distance": number,
    "api_rare": number,
    "api_broken": TMstMaterials,
    "api_info": string,
    "api_usebull": string,
    "api_version": number
  }

  type TMstMapArea = {
    "api_id": number,
    "api_name": string,
    "api_type": number
  }

  type TMstMapInfo = {
    "api_id": number,
    "api_maparea_id": number,
    "api_no": number,
    "api_name": string,
    "api_level": number,
    "api_opetext": string,
    "api_infotext": string,
    "api_item": [number, number, number, number],
    "api_max_maphp": number | null,
    "api_required_defeat_count": number | null,
    "api_sally_flag": [number, number, number]
  }
  export const api_mst_ship: TMstShip[]
  export const api_mst_stype: TMstShipType[]
  export const api_mst_slotitem: TMstEquipment[]
  export const api_mst_slotitem_equiptype: TMstEquipmentCategory[]
  export const api_mst_equip_exslot: number[]
  export const api_mst_equip_exslot_ship: TMstReinforceExpansionShip[]
  export const api_mst_maparea: TMstMapArea[]
  export const api_mst_mapinfo: TMstMapInfo[]
}