/**
 * 艦隊の種類
 * 通常, 空母機動部隊, 水上打撃部隊, 輸送護衛部隊, 敵連合
 */
const enum FleetType {
  /** 通常 */
  Single,

  /** 空母機動部隊 */
  CarrierTaskForce = 1,

  /** 水上打撃部隊 */
  SurfaceTaskForce = 2,

  /** 輸送護衛部隊 */
  TransportEscort = 4,

  /** 敵連合 */
  Combined
}

export default FleetType
