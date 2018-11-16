/**
 * 戦闘種別
 *
 * https://github.com/andanteyk/ElectronicObserver/blob/develop/ElectronicObserver/Other/Information/apilist.txt
 * 数値は api_event_kind
 */
const enum BattleType {
  Empty = 0,
  NormalBattle = 1,
  NightBattle = 2,
  NightToDayBattle = 3,
  /** 航空戦 例:1-6 */
  AerialBattle = 4,
  EnemyCombinedFleetBattle = 5,
  /**
   * 長距離空襲戦
   * ld_airbattle
   */
  AirDefenseBattle = 6,
  NightToDayEnemyCombinedFleetBattle = 7
}

export default BattleType
