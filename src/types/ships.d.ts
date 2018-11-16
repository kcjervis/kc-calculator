declare module '*/ships' {
  export type TShipStat = number | [number, number]
  export interface IShipData {
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
  }
  const ships: IShipData[]
  export default ships
}