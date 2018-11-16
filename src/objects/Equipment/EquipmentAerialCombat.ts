import { EquipmentCategoryId } from '../../data'
import { IEquipmentBase } from './BaseEquipment'

export interface IEquipmentAerialCombat {
  /** 加重対空 */
  adjustedAntiAir: number

  /** 艦隊防空 */
  fleetAntiAir: number

  /** 制空係数 */
  fighterPowerMultiplier: number

  /** 基地防空係数 */
  interceptionPowerMultiplier: number

  /** 制空値を計算 */
  calculateFighterPower: (slotSize: number) => number

  /** 基地防空時の制空値を計算 */
  calculateInterceptionPower: (slotSize: number) => number
}

export default class EquipmentAerialCombat implements IEquipmentAerialCombat {
  constructor(private readonly equipment: IEquipmentBase) {}

  get adjustedAntiAir() {
    const { antiAir, category, improvement, isHighAngleMount } = this.equipment
    if (antiAir === 0) {
      return 0
    }

    const categoryId = category.id
    let multiplier = 0
    if (categoryId === EquipmentCategoryId.AntiAircraftGun) {
      multiplier = 6
    } else if (categoryId === EquipmentCategoryId.AntiAircraftFireDirector || isHighAngleMount) {
      multiplier = 4
    } else if (category.isRadar) {
      multiplier = 3
    }
    return multiplier * antiAir + improvement.adjustedAntiAirModifier
  }

  get fleetAntiAir() {
    const { name, antiAir, category, isHighAngleMount, improvement } = this.equipment
    if (antiAir === 0) {
      return 0
    }

    const categoryId = category.id
    let multiplier = 0
    if (categoryId === EquipmentCategoryId.AntiAircraftFireDirector || isHighAngleMount) {
      multiplier = 0.35
    } else if (categoryId === EquipmentCategoryId.AntiAircraftShell) {
      multiplier = 0.6
    } else if (category.isRadar) {
      multiplier = 0.4
    } else if (name === '46cm三連装砲') {
      multiplier = 0.25
    } else {
      multiplier = 0.2
    }
    return multiplier * antiAir + improvement.fleetAntiAirModifier
  }

  get fighterPowerMultiplier() {
    const { antiAir, interception, improvement } = this.equipment
    return antiAir + 1.5 * interception + improvement.fighterPowerModifier
  }

  get interceptionPowerMultiplier() {
    const { antiAir, interception, antiBomber, improvement } = this.equipment
    return antiAir + interception + 2 * antiBomber + improvement.fighterPowerModifier
  }

  public calculateFighterPower(slotSize: number) {
    const { proficiency } = this.equipment
    const multiplier = this.fighterPowerMultiplier
    return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
  }

  public calculateInterceptionPower(slotSize: number) {
    const { proficiency } = this.equipment
    const multiplier = this.interceptionPowerMultiplier
    return Math.floor(multiplier * Math.sqrt(slotSize) + proficiency.fighterPowerBonus)
  }
}
