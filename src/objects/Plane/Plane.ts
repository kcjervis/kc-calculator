import { equipmentFighterPower, equipmentInterceptionPower } from '../../Battle/AerialCombat/fighterCombat'
import { AirControlState } from '../../constants'
import { EquipmentCategory } from '../../data'
import { IEquipment } from '../Equipment'

export interface IPlane {
  equipment: IEquipment
  index: number
  category: EquipmentCategory
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
  constructor(public readonly equipment: IEquipment, private readonly slots: number[], public readonly index: number) {}

  get category() {
    return this.equipment.category
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
    const { equipment, slotSize } = this
    return equipmentFighterPower(equipment, slotSize)
  }

  get interceptionPower() {
    const { equipment, slotSize } = this
    return equipmentInterceptionPower(equipment, slotSize)
  }

  get canContact() {
    const { category } = this
    return category.isTorpedoBomber || category.isReconnaissanceAircraft
  }

  get contactTriggerFactor() {
    const { equipment, slotSize } = this
    return Math.floor(equipment.los * Math.sqrt(slotSize))
  }

  public contactSelectionRate = (state: AirControlState) => {
    const { los, improvement } = this.equipment
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
    const { category, equipment, slotSize } = this
    if (!category.isObservationPlane) {
      return 0
    }
    return equipment.los * Math.floor(Math.sqrt(slotSize))
  }

  get isSwordfish() {
    return this.equipment.name.includes('Swordfish')
  }

  get isNightFighter() {
    return this.equipment.iconId === 45
  }

  get isNightAttacker() {
    return this.equipment.iconId === 46
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
    const { isNightPlane, isSwordfish, equipment } = this
    return isNightPlane || isSwordfish || [154, 320].includes(equipment.masterId)
  }

  public calcNightAerialAttackPower(isAntiInstallation: boolean = false) {
    const { isNightPlane, isNightAircraft, equipment, slotSize } = this
    if (!isNightAircraft) {
      return 0
    }

    const { firepower, torpedo, asw, bombing } = equipment
    let nightAircraftModifierA = 0
    let nightAircraftModifierB = 0.3
    if (isNightPlane) {
      nightAircraftModifierA = 3
      nightAircraftModifierB = 0.45
    }

    const improvementModifier = Math.sqrt(equipment.improvement.value)
    return (
      firepower +
      (isAntiInstallation ? 0 : torpedo) +
      nightAircraftModifierA * slotSize +
      nightAircraftModifierB * (firepower + torpedo + asw + bombing) * Math.sqrt(slotSize) +
      improvementModifier
    )
  }

  public shotdown(value: number) {
    this.slotSize -= value
    if (this.slotSize < 0) {
      this.slotSize = 0
    }
  }
}
