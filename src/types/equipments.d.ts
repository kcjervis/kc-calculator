declare module '*/equipments' {
  export interface IEquipmentData {
    id: number
    sortNo: number
    name: string
    typeIds: Readonly<number[]>
    hp?: number
    armor?: number
    firepower?: number
    torpedo?: number
    speed?: number
    bombing?: number
    antiAir?: number
    asw?: number
    accuracy?: number
    evasion?: number
    los?: number
    luck?: number
    range?: number
    radius?: number
  }
  const equipments: IEquipmentData[]
  export default equipments
}