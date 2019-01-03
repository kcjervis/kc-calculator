import { equipmentFighterPower, equipmentInterceptionPower } from '../../AerialCombat/fighterCombat'
import { AirControlState } from '../../constants'
import { EquipmentCategory } from '../../data'
import { IEquipment } from '../Equipment'

export interface IPlane {
  equipment: IEquipment
  category: EquipmentCategory
  slotSize: number
  fighterPower: number
  interceptionPower: number

  canContact: boolean
  contactTriggerFactor: number
  contactSelectionRate: (state: AirControlState) => number

  canParticipateInAirstrike: boolean

  fleetLosModifier: number

  shotdown: (value: number) => void
}

export default class Plane implements IPlane {
  constructor(
    public readonly equipment: IEquipment,
    private readonly slots: number[],
    private readonly index: number
  ) {}

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
    return Math.ceil(this.equipment.los) / (20 - 2 * state.contactMultiplier)
  }

  get canParticipateInAirstrike() {
    const { category } = this
    return category.isDiveBomber || category.isTorpedoBomber
  }

  get fleetLosModifier() {
    const { category, equipment, slotSize } = this
    if (!category.isObservationPlane) {
      return 0
    }
    return equipment.los * Math.floor(Math.sqrt(slotSize))
  }

  public shotdown(value: number) {
    this.slotSize -= value
    if (this.slotSize < 0) {
      this.slotSize = 0
    }
  }
}
