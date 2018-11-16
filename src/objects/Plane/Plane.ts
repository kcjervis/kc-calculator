import { EquipmentCategory } from '../../data'
import { IEquipment } from '../Equipment'

export interface IPlane {
  category: EquipmentCategory
  slotSize: number
  fighterPower: number
  interceptionPower: number

  canParticipateInAirstrike: boolean

  shotdown: (value: number) => void
}

export default class Plane implements IPlane {
  constructor(
    private readonly equipment: IEquipment,
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
    return equipment.aerialCombat.calculateFighterPower(slotSize)
  }

  get interceptionPower() {
    const { equipment, slotSize } = this
    return equipment.aerialCombat.calculateInterceptionPower(slotSize)
  }

  get canParticipateInAirstrike() {
    const { category } = this
    return category.isDiveBomber || category.isTorpedoBomber
  }

  public shotdown(value: number) {
    this.slotSize -= value
    if (this.slotSize < 0) {
      this.slotSize = 0
    }
  }
}
