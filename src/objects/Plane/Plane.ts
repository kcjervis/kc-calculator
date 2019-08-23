import { gearFighterPower, gearInterceptionPower } from "../../Battle/AerialCombat/fighterCombat"
import { AirControlState } from "../../constants"
import { GearCategory } from "../../data"
import { IGear } from "../Gear"

export interface IPlane {
  gear: IGear
  index: number
  category: GearCategory
  slotSize: number
  fighterPower: number
  interceptionPower: number

  canContact: boolean
  contactTriggerFactor: number
  contactSelectionRate: (state: AirControlState) => number

  canParticipateInAirstrike: boolean

  fleetLosModifier: number

  isSwordfish: boolean
  isNightFighter: boolean
  isNightAttacker: boolean
  isNightPlane: boolean
  isNightAircraft: boolean
  calcNightAerialAttackPower: (isAntiInstallation?: boolean) => number

  shotdown: (value: number) => void
}

export default class Plane implements IPlane {
  constructor(public readonly gear: IGear, private readonly slots: number[], public readonly index: number) {}

  get category() {
    return this.gear.category
  }

  get slotSize() {
    const { slots, index } = this
    return slots[index]
  }
  set slotSize(value: number) {
    const { slots, index } = this
    slots[index] = value
  }

  get fighterPower() {
    const { gear, slotSize } = this
    return gearFighterPower(gear, slotSize)
  }

  get interceptionPower() {
    const { gear, slotSize } = this
    return gearInterceptionPower(gear, slotSize)
  }

  get canContact() {
    const { category } = this
    return category.isTorpedoBomber || category.isReconnaissanceAircraft
  }

  get contactTriggerFactor() {
    const { gear, slotSize } = this
    return Math.floor(gear.los * Math.sqrt(slotSize))
  }

  public contactSelectionRate = (state: AirControlState) => {
    const { los, improvement } = this.gear
    return Math.ceil(los + improvement.contactSelectionModifier) / (20 - 2 * state.contactMultiplier)
  }

  get canParticipateInAirstrike() {
    const { category, slotSize } = this
    if (slotSize === 0) {
      return false
    }
    return category.isDiveBomber || category.isTorpedoBomber
  }

  get fleetLosModifier() {
    const { category, gear, slotSize } = this
    if (!category.isObservationPlane) {
      return 0
    }
    return gear.los * Math.floor(Math.sqrt(slotSize))
  }

  get isSwordfish() {
    return this.gear.name.includes("Swordfish")
  }

  get isNightFighter() {
    return this.gear.iconId === 45
  }

  get isNightAttacker() {
    return this.gear.iconId === 46
  }

  /**
   * 夜戦夜攻
   */
  get isNightPlane() {
    return this.isNightFighter || this.isNightAttacker
  }

  /**
   * 夜戦夜攻
   * Swordfish系
   * 零戦62型(爆戦/岩井隊)
   * 彗星一二型(三一号光電管爆弾搭載機)
   */
  get isNightAircraft() {
    const { isNightPlane, isSwordfish, gear } = this
    return isNightPlane || isSwordfish || [154, 320].includes(gear.masterId)
  }

  public calcNightAerialAttackPower = (isAntiInstallation = false) => {
    const { isNightPlane, isNightAircraft, gear, slotSize } = this
    if (!isNightAircraft) {
      return 0
    }

    const { firepower, torpedo, asw, bombing } = gear
    let nightAircraftModifierA = 0
    let nightAircraftModifierB = 0.3
    if (isNightPlane) {
      nightAircraftModifierA = 3
      nightAircraftModifierB = 0.45
    }

    const improvementModifier = Math.sqrt(gear.improvement.value)
    return (
      firepower +
      (isAntiInstallation ? 0 : torpedo) +
      bombing +
      nightAircraftModifierA * slotSize +
      nightAircraftModifierB * (firepower + torpedo + asw + bombing) * Math.sqrt(slotSize) +
      improvementModifier
    )
  }

  public shotdown = (value: number) => {
    this.slotSize -= value
    if (this.slotSize < 0) {
      this.slotSize = 0
    }
  }
}
