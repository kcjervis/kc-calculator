import { api_mst_equip_exslot } from "@jervis/data"
import { ListIterator } from "lodash"
import { sumBy } from "lodash-es"

import { IHealth } from "./Health"
import { IMorale } from "./Morale"
import { IShipNakedStats } from "./ShipNakedStats"
import { IShipStats } from "./ShipStats"

import { MasterShip, ShipClass, ShipType, GearCategory } from "../../data"
import { isNonNullable, shipNameIsKai2 } from "../../utils"
import { IGear } from "../Gear"
import { IPlane } from "../Plane"
import { GearCategoryKey } from "../../data/GearCategory"
import { InstallationType } from "../../types"

type GearIterator<R> = ListIterator<IGear, R>
type GearIteratee<R, S> = GearIterator<R> | S

type GearCategoryIteratee = ListIterator<GearCategory, boolean> | GearCategoryKey

export interface IShip {
  masterId: number
  name: string

  shipClass: ShipClass
  shipType: ShipType

  level: number
  stats: IShipStats
  nakedStats: IShipStats

  health: IHealth
  morale: IMorale

  slots: number[]
  slotCapacities: number[]
  gears: Array<IGear | undefined>
  planes: IPlane[]

  fighterPower: number

  installationType: InstallationType
  isInstallation: boolean

  canEquip: (gear: IGear, slotIndex: number) => boolean

  hasGear: (iteratee: GearIteratee<boolean, number>) => boolean
  countGear: (iteratee?: GearIteratee<boolean, number>) => number

  hasGearCategory: (...args: GearCategoryIteratee[]) => boolean
  countGearCategory: (...args: GearCategoryIteratee[]) => number

  totalEquipmentStats: (iteratee: ((gear: IGear) => number) | keyof IGear) => number

  canNightAttack: boolean

  /** 廃止予定 */
  equipments: Array<IGear | undefined>
}

export default class Ship implements IShip {
  public slotCapacities: number[]

  constructor(
    private readonly master: MasterShip,
    public readonly stats: IShipStats,
    public readonly nakedStats: IShipNakedStats,
    public readonly health: IHealth,
    public readonly morale: IMorale,
    public readonly slots: number[],
    public readonly gears: Array<IGear | undefined>,
    public readonly planes: IPlane[]
  ) {
    this.slotCapacities = master.slotCapacities.concat()
  }

  /** 廃止予定 */
  get equipments() {
    return this.gears
  }

  get masterId() {
    return this.master.id
  }

  get name() {
    return this.master.name
  }

  get shipClass() {
    return this.master.shipClass
  }

  get shipType() {
    return this.master.shipType
  }

  get level() {
    return this.nakedStats.level
  }

  get fighterPower() {
    return sumBy(
      this.planes.filter(({ category }) => category.isFighter || category.isTorpedoBomber || category.isDiveBomber),
      "fighterPower"
    )
  }

  get isInstallation() {
    return this.nakedStats.speed === 0
  }

  get installationType() {
    const { isInstallation, name } = this
    if (!isInstallation) {
      return "None"
    }
    if (name.includes("砲台")) {
      return "Pillbox"
    }
    if (name.includes("離島") || name.includes("中枢")) {
      return "IsolatedIsland"
    }
    if (name.includes("集積")) {
      return "SupplyDepot"
    }
    return "SoftSkinned"
  }

  get nonNullableGears() {
    return this.gears.filter(isNonNullable)
  }

  public canEquip = (gear: IGear, slotIndex: number) => {
    const shipId = this.masterId
    const { equippable, isAbyssal } = this.master
    const { masterId: gearId, category } = gear

    if (isAbyssal) {
      return true
    }

    if (!equippable.categories.includes(category.id)) {
      return false
    }

    // Richelieu
    if ([492, 392].includes(shipId) && category.is("SeaplaneBomber")) {
      // Laté 298B
      return gearId === 194
    }

    if (this.slots.length <= slotIndex) {
      const turbine = 33
      return (
        api_mst_equip_exslot.includes(category.id) || equippable.expantionSlot.includes(gearId) || gearId === turbine
      )
    }

    if (this.shipClass.is("IseClass") && shipNameIsKai2(this.name)) {
      return !(slotIndex > 1 && category.isMainGun)
    }

    return true
  }

  public hasGear = (iteratee: GearIteratee<boolean, number>) => {
    if (typeof iteratee === "number") {
      return this.nonNullableGears.some(({ masterId }) => masterId === iteratee)
    }
    return this.nonNullableGears.some(iteratee)
  }

  public countGear = (iteratee?: GearIteratee<boolean, number>) => {
    const { nonNullableGears } = this
    if (iteratee === undefined) {
      return nonNullableGears.length
    }
    if (typeof iteratee === "number") {
      return nonNullableGears.filter(({ masterId }) => masterId === iteratee).length
    }
    return nonNullableGears.filter(iteratee).length
  }

  public countGearCategory = (...args: GearCategoryIteratee[]) => {
    const categories = this.nonNullableGears.map(({ category }) => category)
    return sumBy(args, arg => {
      if (typeof arg === "string") {
        return categories.filter(category => category.is(arg)).length
      }
      return categories.filter(arg).length
    })
  }

  public hasGearCategory = (...args: GearCategoryIteratee[]) => {
    return this.countGearCategory(...args) > 0
  }

  public totalEquipmentStats = (iteratee: ((gear: IGear) => number) | keyof IGear) => {
    return sumBy(this.nonNullableGears, iteratee)
  }

  get canNightAttack() {
    const { shipClass, shipType, health, master } = this
    if (health.lte("Heavy")) {
      return false
    }

    if (shipClass.is("ArkRoyalClass")) {
      return health.damage !== "Moderate" && this.planes.some(plane => plane.isSwordfish)
    }
    return master.firepower[0] > 0
  }

  public getStat = (type: "hp") => {
    const { level, master, totalEquipmentStats } = this
    const [left, right] = master[type]
    const equipment = totalEquipmentStats(type)
  }
}
