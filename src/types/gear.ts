export type GearStats = {
  gearId: number
  categoryId: number
  iconId: number
  name: string

  hp: number
  firepower: number
  armor: number
  torpedo: number
  antiAir: number
  speed: number
  bombing: number
  asw: number
  los: number
  luck: number
  range: number
  accuracy: number
  evasion: number
  antiBomber: number
  interception: number
  radius: number

  improvable: boolean
}

export type GearState = {
  /** 装備ID */
  gearId: number

  /** 改修値 */
  star: number

  /** 内部熟練度 */
  exp: number
}
