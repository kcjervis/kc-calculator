import { api_mst_equip_exslot, GearId } from "@jervis/data"
import { ListIterator } from "lodash"
import { sumBy } from "lodash-es"

import { IHealth } from "./Health"
import { IMorale } from "./Morale"
import { IShipNakedStats } from "./ShipNakedStats"
import { IShipStats } from "./ShipStats"
import { IDefensePower } from "./DefensePower"

import { MasterShip, ShipClass, ShipType, GearCategory, GearCategoryKey, GearAttribute } from "../../data"
import { isNonNullable, shipNameIsKai2 } from "../../utils"
import { IGear } from "../Gear"
import { IPlane } from "../Plane"
import { InstallationType, ShipShellingStats, ShellingType } from "../../types"

type GearIteratee<R> = GearId | GearAttribute | ((gear: IGear) => R)

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

  hasGear: (iteratee: GearIteratee<boolean>) => boolean
  countGear: (iteratee?: GearIteratee<boolean>) => number

  totalEquipmentStats: (iteratee: ((gear: IGear) => number) | keyof IGear) => number

  canNightAttack: boolean

  getShellingStats: () => ShipShellingStats

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
      return !(slotIndex > 1 && gear.is("MainGun"))
    }

    return true
  }

  public hasGear = (iteratee: GearIteratee<boolean>) => {
    const gears = this.nonNullableGears
    if (typeof iteratee === "string") {
      return gears.some(gear => gear.is(iteratee))
    }
    if (typeof iteratee === "number") {
      return gears.some(({ masterId }) => masterId === iteratee)
    }
    return gears.some(iteratee)
  }

  public countGear = (iteratee?: GearIteratee<boolean>) => {
    const gears = this.nonNullableGears
    if (iteratee === undefined) {
      return gears.length
    }
    if (typeof iteratee === "string") {
      return gears.filter(gear => gear.is(iteratee)).length
    }
    if (typeof iteratee === "number") {
      return gears.filter(({ masterId }) => masterId === iteratee).length
    }
    return gears.filter(iteratee).length
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

  /**
   * 巡洋艦砲フィット補正
   *
   * 軽巡軽量砲補正と伊重巡フィット砲補正
   * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#軽巡軽量砲補正
   * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#伊重巡フィット砲補正
   */
  private calcCruiserFitBonus = () => {
    const { shipType, shipClass, countGear } = this
    let fitBonus = 0
    const isCruiser = shipType.any("LightCruiser", "TorpedoCruiser", "TrainingCruiser")
    const isZaraClass = shipClass.is("ZaraClass")

    if (isCruiser) {
      const singleGunCount = countGear(gear => [GearId["14cm単装砲"], GearId["15.2cm単装砲"]].includes(gear.masterId))
      const twinGunCount = countGear(gear =>
        [GearId["15.2cm連装砲"], GearId["14cm連装砲"], GearId["15.2cm連装砲改"]].includes(gear.masterId)
      )
      fitBonus += Math.sqrt(singleGunCount) + 2 * Math.sqrt(twinGunCount)
    }
    if (isZaraClass) {
      fitBonus += Math.sqrt(countGear(GearId["203mm/53 連装砲"]))
    }
    return fitBonus
  }

  private getRemainingPlanes = () => this.planes.filter(isNonNullable)

  /**
   * 熟練度補正
   * 戦爆連合は適当
   */
  private getNormalProficiencyModifiers = () => {
    const modifiers = { power: 1, hitRate: 0, criticalRate: 0 }

    const planes = this.getRemainingPlanes().filter(
      ({ category }) => category.isDiveBomber || category.isTorpedoBomber || category.is("LargeFlyingBoat")
    )
    modifiers.power =
      1 +
      sumBy(planes, plane => {
        if (plane.index === 0) {
          return plane.gear.proficiency.criticalPowerModifier / 100
        }
        return plane.gear.proficiency.criticalPowerModifier / 200
      })

    const average = sumBy(planes, plane => plane.gear.proficiency.internal) / planes.length
    let averageModifierA = 0
    let averageModifierB = 0
    if (average >= 10) {
      averageModifierA = Math.floor(Math.sqrt(0.1 * average))
    }
    if (average >= 25) {
      averageModifierB = 1
    }
    if (average >= 40) {
      averageModifierB = 2
    }
    if (average >= 55) {
      averageModifierB = 3
    }
    if (average >= 70) {
      averageModifierB = 4
    }
    if (average >= 80) {
      averageModifierB = 6
    }
    if (average >= 100) {
      averageModifierB = 9
    }
    modifiers.hitRate = averageModifierA + averageModifierB

    modifiers.criticalRate = sumBy(planes, plane => {
      const { internal, level } = plane.gear.proficiency
      let levelBonus = 0
      if (level === 7) {
        levelBonus = 3
      }
      return (Math.sqrt(Math.sqrt(0.1 * internal)) + levelBonus) / 100
    })

    return modifiers
  }

  /**
   * 戦爆熟練度補正
   * 分からないから適当
   */
  private getSpecialProficiencyModifiers = () => {
    const modifiers = { power: 1, hitRate: 0, criticalRate: 0 }
    const shellingPlanes = this.getRemainingPlanes().filter(
      plane => plane.participatesInCarrierShelling && plane.gear.proficiency.internal === 120
    )
    if (shellingPlanes.some(plane => plane.index === 0)) {
      modifiers.power = 1.25
    } else {
      modifiers.power = 1.106
    }

    return modifiers
  }

  private getShellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasGear } = this
    if (shipType.isAircraftCarrierClass) {
      return "CarrierShelling"
    }

    if (!shipClass.is("RevisedKazahayaClass") && !isInstallation) {
      return "Shelling"
    }

    if (hasGear(gear => gear.category.isAerialCombatAircraft)) {
      return "CarrierShelling"
    }

    return "Shelling"
  }

  /**
   * 徹甲弾補正
   */
  private getApShellModifiers = () => {
    const modifier = { power: 1, accuracy: 1 }

    const hasArmorPiercingShell = this.hasGear("ArmorPiercingShell")
    const hasMainGun = this.hasGear("MainGun")

    if (!hasArmorPiercingShell || !hasMainGun) {
      return modifier
    }

    const hasSecondaryGun = this.hasGear("SecondaryGun")
    const hasRader = this.hasGear("Radar")

    if (hasSecondaryGun && hasRader) {
      return { power: 1.15, accuracy: 1.3 }
    }
    if (hasSecondaryGun) {
      return { power: 1.15, accuracy: 1.2 }
    }
    if (hasRader) {
      return { power: 1.1, accuracy: 1.25 }
    }
    return { power: 1.08, accuracy: 1.1 }
  }

  public getShellingStats = (): ShipShellingStats => {
    return {
      shellingType: this.getShellingType(),
      improvementModifier: this.totalEquipmentStats(gear => gear.improvement.shellingPowerModifier),
      cruiserFitBonus: this.calcCruiserFitBonus(),
      healthModifier: this.health.shellingPowerModifier,
      apShellModifiers: this.getApShellModifiers(),

      fitGunAccuracyBonus: 0
    }
  }
}
