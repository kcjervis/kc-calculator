import { api_mst_equip_exslot, GearId, ShipId } from "@jervis/data"
import { sumBy, range, random } from "lodash-es"
import sift, { SiftQuery } from "sift"

import { IHealth } from "./Health"
import { IMorale } from "./Morale"
import { IShipNakedStats } from "./ShipNakedStats"
import { IShipStats } from "./ShipStats"

import { MasterShip, ShipClass, ShipType, GearAttribute, ShipAttribute } from "../../data"
import { isNonNullable, shipNameIsKai2 } from "../../utils"
import { getApShellModifiers, calcCruiserFitBonus, calcEvasionValue } from "../../formulas"
import { IGear } from "../gear"
import { IPlane } from "../plane"
import { DefensePower, ShellingType } from "../../types"
import { AttackPowerModifierRecord } from "../../common"
import { getSpecialEnemyModifiers } from "../../data"

export type ShipQuery =
  | ShipId
  | SiftQuery<{
      shipId: number
      shipClassId: number
      shipTypeId: number
      remodelGroup: number
      rank: number
      attrs: ShipAttribute[]
    }>

export type GearIteratee<R> = GearId | GearAttribute | ((gear: IGear) => R)

type ProficiencyModifiers = { power: number; hitRate: number; criticalRate: number }

export interface IShip {
  masterId: number
  name: string
  ruby: string

  shipId: number
  shipClassId: number
  shipTypeId: number
  remodelGroup: number
  rank: number

  shipClass: ShipClass
  shipType: ShipType

  level: number
  stats: IShipStats
  nakedStats: IShipNakedStats

  health: IHealth
  morale: IMorale

  slots: number[]
  slotCapacities: number[]
  gears: Array<IGear | undefined>
  planes: IPlane[]

  fighterPower: number

  shipAccuracy: number

  fleetLosFactor: number

  isInstallation: boolean

  is: (attr: ShipAttribute) => boolean
  match: (query: ShipQuery) => boolean

  canEquip: (gear: IGear, slotIndex: number) => boolean

  hasGear: (iteratee: GearIteratee<boolean>) => boolean
  countGear: (iteratee?: GearIteratee<boolean>) => number

  totalEquipmentStats: (iteratee: ((gear: IGear) => number) | keyof IGear) => number

  canNightAttack: boolean

  getCruiserFitBonus: () => number

  getDefensePower: () => DefensePower
  getSpecialEnemyModifiers: (target: IShip) => AttackPowerModifierRecord
  getAntiInstallationModifier: (
    target: IShip
  ) => Required<Pick<AttackPowerModifierRecord, "a5" | "a13" | "a13next" | "b12" | "b13" | "b13next">>
  getNormalProficiencyModifiers: () => ProficiencyModifiers
  getSpecialProficiencyModifiers: () => ProficiencyModifiers

  calcEvasionValue: (formationModifier: number, postcapModifier?: number) => number

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
    public readonly planes: IPlane[],
    public readonly attrs: ShipAttribute[]
  ) {
    this.slotCapacities = master.slotCapacities.concat()
  }

  get shipId() {
    return this.master.shipId
  }
  get shipClassId() {
    return this.master.shipClassId
  }
  get shipTypeId() {
    return this.master.shipType.id
  }
  get remodelGroup() {
    return this.master.remodelGroup
  }
  get rank() {
    return this.master.sortId % 10
  }

  /** 廃止予定 */
  get equipments() {
    return this.gears
  }

  /** 廃止予定 */
  get masterId() {
    return this.master.shipId
  }

  get name() {
    return this.master.name
  }

  get ruby() {
    return this.master.readingName
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

  get shipAccuracy() {
    const { level, luck } = this.nakedStats
    return 2 * Math.sqrt(level) + 1.5 * Math.sqrt(luck)
  }

  get fighterPower() {
    return sumBy(
      this.planes.filter(({ gear }) => gear.is("Fighter") || gear.is("TorpedoBomber") || gear.is("DiveBomber")),
      "fighterPower"
    )
  }

  get fleetLosFactor() {
    const nakedLos = this.nakedStats.los
    const totalSeaplanesLos = sumBy(this.planes, plane => plane.fleetLosModifier)

    return nakedLos + totalSeaplanesLos
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

  public is = (attr: ShipAttribute) => this.attrs.includes(attr)

  public canEquip = (gear: IGear, slotIndex: number) => {
    const { shipId, shipClass } = this
    const { equippable, isAbyssal } = this.master
    const { gearId, categoryId } = gear

    if (isAbyssal) {
      return true
    }

    if (!equippable.categories.includes(categoryId)) {
      return false
    }

    // Richelieu
    if ([492, 392].includes(shipId) && gear.is("SeaplaneBomber")) {
      return gearId === GearId["Laté 298B"]
    }

    if (this.is("RoyalNavy") && this.shipType.isBattleshipClass && gear.is("SeaplaneBomber")) {
      return [GearId["Swordfish(水上機型)"], GearId["Swordfish Mk.III改(水上機型)"]].includes(gearId)
    }

    if (this.slots.length <= slotIndex) {
      const turbine = 33
      return (
        api_mst_equip_exslot.includes(categoryId) || equippable.expantionSlot.includes(gearId) || gearId === turbine
      )
    }

    if (shipClass.is("IseClass") && this.is("Kai2")) {
      return !(slotIndex > 1 && gear.is("MainGun"))
    }

    if (shipClass.is("YuubariClass") && this.is("Kai2")) {
      if (slotIndex >= 3 && (gear.is("MainGun") || gear.is("Torpedo") || gear.is("MidgetSubmarine"))) {
        return false
      }
      if (slotIndex === 4) {
        return gear.is("AntiAircraftGun") || gear.is("SmallRadar") || gear.is("CombatRation")
      }
    }

    return true
  }

  public match = (query: ShipQuery) => {
    if (typeof query === "number") {
      return this.shipId === query
    }
    return sift(query)(this)
  }

  public hasGear = (iteratee: GearIteratee<boolean>) => {
    const gears = this.nonNullableGears
    if (typeof iteratee === "string") {
      return gears.some(gear => gear.is(iteratee))
    }
    if (typeof iteratee === "number") {
      return gears.some(({ gearId }) => gearId === iteratee)
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
      return gears.filter(({ gearId }) => gearId === iteratee).length
    }
    return gears.filter(iteratee).length
  }

  public totalEquipmentStats = (iteratee: ((gear: IGear) => number) | keyof IGear) => {
    return sumBy(this.nonNullableGears, iteratee)
  }

  public getDefensePower = (): DefensePower => {
    const { armor } = this.stats
    const mod = this.totalEquipmentStats(gear => gear.improvement.defensePowerModifier)

    const base = armor + mod
    const min = Math.max(base, 1) * 0.7
    const max = min + Math.floor(base - 1) * 0.6

    return {
      min,
      max,

      values: () => range(Math.floor(base)).map(value => min + value * 0.6),
      random: () => min + random(Math.floor(base - 1)) * 0.6
    }
  }

  get canNightAttack() {
    const { shipClass, shipType, health, master } = this
    if (health.lte("Taiha")) {
      return false
    }

    if (shipClass.is("ArkRoyalClass")) {
      return health.damage !== "Chuuha" && this.planes.some(plane => plane.isSwordfish)
    }
    return master.firepower[0] > 0
  }

  public getCruiserFitBonus = () => {
    const { shipType, shipClass, countGear } = this
    const isLightCruiserClass = shipType.any("LightCruiser", "TorpedoCruiser", "TrainingCruiser")
    const isZaraClass = shipClass.is("ZaraClass")
    const singleGunCount = countGear(gear => [GearId["14cm単装砲"], GearId["15.2cm単装砲"]].includes(gear.gearId))
    const twinGunCount = countGear(gear =>
      [GearId["15.2cm連装砲"], GearId["14cm連装砲"], GearId["15.2cm連装砲改"]].includes(gear.gearId)
    )
    return calcCruiserFitBonus({
      isLightCruiserClass,
      singleGunCount,
      twinGunCount,
      isZaraClass,
      zaraGunCount: Math.sqrt(countGear(GearId["203mm/53 連装砲"]))
    })
  }

  private getRemainingPlanes = () => this.planes.filter(isNonNullable)

  private getShellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasGear } = this
    if (shipType.isAircraftCarrierClass) {
      return "CarrierShelling"
    }

    if (!shipClass.is("RevisedKazahayaClass") && !isInstallation) {
      return "Shelling"
    }

    if (hasGear("DiveBomber") || hasGear("TorpedoBomber")) {
      return "CarrierShelling"
    }

    return "Shelling"
  }

  /**
   * 通常熟練度補正
   * @see https://kancolle.fandom.com/ja/wiki/%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89:464#49
   * @see https://twitter.com/sumika_green/status/665186962043637760
   */
  public getNormalProficiencyModifiers = () => {
    const modifiers = { power: 1, hitRate: 0, criticalRate: 0 }
    if (this.getShellingType() !== "CarrierShelling") {
      return modifiers
    }

    const planes = this.getRemainingPlanes().filter(
      plane => plane.is("DiveBomber") || plane.is("TorpedoBomber") || plane.is("LargeFlyingBoat")
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

      const firstSlotBonus = plane.index === 0 ? 6 : 0

      const modifier = (Math.sqrt(internal * 0.1) + level) / 2 + 1
      return Math.floor(modifier + firstSlotBonus) / 100
    })

    return modifiers
  }

  /**
   * 戦爆熟練度補正
   * 分からないから適当
   */
  public getSpecialProficiencyModifiers = () => {
    const modifiers = { power: 1, hitRate: 0, criticalRate: 0 }
    if (this.getShellingType() !== "CarrierShelling") {
      return modifiers
    }

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

  public getSpecialEnemyModifiers = (target: IShip): AttackPowerModifierRecord => getSpecialEnemyModifiers(this, target)

  public getAntiInstallationModifier = (target: IShip) => {
    const modifier = this.getSpecialEnemyModifiers(target)
    const defaultModifier = { a13: 1, a13next: 1, a5: 1, b12: 0, b13: 0, b13next: 0 }
    return { ...defaultModifier, ...modifier }
  }

  public calcEvasionValue = (formationModifier: number, postcapModifier?: number) => {
    const { evasion, luck } = this.stats

    const totalStar = this.totalEquipmentStats(gear => {
      if (!gear.is("EngineImprovement")) {
        return 0
      }
      return gear.star
    })
    const improvementModifier = Math.floor(1.5 * Math.sqrt(totalStar))

    return calcEvasionValue({ evasion, luck, improvementModifier, formationModifier, postcapModifier })
  }
}
