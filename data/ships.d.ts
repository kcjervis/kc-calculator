
export declare type TShipStat = number | [number, number]
export declare interface IShipData {
  id: number
  sortNo: number
  sortId: number
  name: string
  readingName: string
  shipTypeId: number
  classId: number
  hp: TShipStat
  firepower: TShipStat
  armor: TShipStat
  torpedo: TShipStat
  evasion: TShipStat
  antiAir: TShipStat
  asw: TShipStat
  speed: number
  los: TShipStat
  range: number
  luck: TShipStat
  fuel: number
  ammo: number
  slotCapacities: Readonly<number[]>
  equipments: Readonly<Array<number | { id: number; improvement: number }>>
  remodel?: Readonly<{
    nextId: number
    nextLevel: number
  }>
  /** 特殊な装備可能設定 */
  equippable?: {
    /** 装備カテゴリによる設定 */
    categories?: number[],
    /** 補強増設に装備できるID一覧 */
    expantionSlot?: number[]
  }
}
declare const ships: IShipData[]
export default ships