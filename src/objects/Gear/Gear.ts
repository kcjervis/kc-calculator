import { GearCategory, MasterGear } from "../../data"
import { IImprovement } from "./Improvement"
import { IProficiency } from "./Proficiency"

type GearStats = {
  hp: number
  armor: number
  firepower: number
  torpedo: number
  speed: number
  bombing: number
  antiAir: number
  asw: number
  los: number
  accuracy: number
  evasion: number
  interception: number
  antiBomber: number
  luck: number
  range: number
  radius: number
}

export interface IGearStats {
  hp: number
  armor: number
  firepower: number
  torpedo: number
  speed: number
  bombing: number
  antiAir: number
  asw: number
  los: number
  accuracy: number
  evasion: number
  interception: number
  antiBomber: number
  luck: number
  range: number
  radius: number
}

export interface IGear extends GearStats {
  /** 装備ID */
  masterId: number
  name: string

  category: GearCategory
  iconId: number

  /** 改修度 */
  improvement: IImprovement

  /** 熟練度 */
  proficiency: IProficiency

  isHighAngleMount: boolean

  isSurfaceRadar: boolean

  isAirRadar: boolean

  isAntiInstallationBomber: boolean
}

export default class Gear implements IGear {
  constructor(
    private readonly master: MasterGear,
    public readonly improvement: IImprovement,
    public readonly proficiency: IProficiency
  ) {}

  get masterId() {
    return this.master.id
  }

  get name() {
    return this.master.name
  }

  get category() {
    return this.master.category
  }

  get iconId() {
    return this.master.iconId
  }

  get hp() {
    return this.master.hp
  }

  get armor() {
    return this.master.armor
  }

  get firepower() {
    return this.master.firepower
  }

  get torpedo() {
    return this.master.torpedo
  }

  get speed() {
    return this.master.speed
  }

  get bombing() {
    return this.master.bombing
  }

  get antiAir() {
    return this.master.antiAir
  }

  get asw() {
    return this.master.asw
  }

  get accuracy() {
    return this.master.accuracy
  }

  get interception() {
    return this.master.interception
  }

  get evasion() {
    return this.master.evasion
  }

  get antiBomber() {
    return this.master.antiBomber
  }

  get los() {
    return this.master.los
  }

  get luck() {
    return this.master.luck
  }

  get range() {
    return this.master.range
  }

  get radius() {
    return this.master.radius
  }

  get isAbyssal() {
    return this.masterId > 500
  }

  get isHighAngleMount() {
    return this.master.isHighAngleMount()
  }

  get isSurfaceRadar() {
    return this.master.isSurfaceRadar()
  }

  get isAirRadar() {
    return this.master.isAirRadar()
  }

  get isAntiInstallationBomber() {
    return this.master.isAntiInstallationBomber()
  }
}
