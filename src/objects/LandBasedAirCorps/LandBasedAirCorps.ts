import { sumBy } from 'lodash-es'

import { nonNullable } from '../../utils'
import { IEquipment } from '../Equipment'
import { createPlanes, IPlane } from '../Plane'

// 陸偵出撃制空補正
const getReconnaissanceFighterPowerModifier = (equip: IEquipment) => {
  const { category, los } = equip
  if (!category.is('LandBasedReconnaissanceAircraft')) {
    return 1
  }
  if (los <= 7) {
    return 1.12
  } else if (los === 8) {
    return 1.15
  }
  return 1.18
}

const getReconnaissanceInterceptionPowerModifier = (equip: IEquipment) => {
  const { category, los } = equip
  if (category.is('CarrierBasedReconnaissanceAircraft') || category.is('CarrierBasedReconnaissanceAircraft2')) {
    if (los <= 7) {
      return 1.2
    } else if (los === 8) {
      // 予測値
      return 1.25
    }
    return 1.3
  }
  if (category.is('LandBasedReconnaissanceAircraft')) {
    return 1.18
  }
  if (category.is('ReconnaissanceSeaplane') || category.is('LargeFlyingBoat')) {
    if (los <= 7) {
      return 1.1
    } else if (los === 8) {
      return 1.13
    }
    return 1.16
  }
  return 1
}

export interface ILandBasedAirCorps {
  slots: number[]
  equipments: Array<IEquipment | undefined>
  planes: IPlane[]

  fighterPower: number
  interceptionPower: number

  minCombatRadius: number
  combatRadius: number
}

export default class LandBasedAirCorps implements ILandBasedAirCorps {
  public readonly planes: IPlane[]
  constructor(public slots: number[], public readonly equipments: Array<IEquipment | undefined>) {
    this.planes = createPlanes(slots, equipments)
  }

  get nonNullableEquipments() {
    return this.equipments.filter(nonNullable)
  }

  private get hasPlanes() {
    return this.nonNullableEquipments.length > 0
  }

  get fighterPower() {
    if (!this.hasPlanes) {
      return 0
    }
    const total = sumBy(this.planes, plane => plane.fighterPower)
    const reconnaissanceModifier = Math.max(...this.nonNullableEquipments.map(getReconnaissanceFighterPowerModifier))
    return Math.floor(total * reconnaissanceModifier)
  }

  get interceptionPower() {
    if (!this.hasPlanes) {
      return 0
    }
    const total = sumBy(this.planes, plane => plane.interceptionPower)
    const reconnaissanceModifier = Math.max(
      ...this.nonNullableEquipments.map(getReconnaissanceInterceptionPowerModifier)
    )
    return Math.floor(total * reconnaissanceModifier)
  }

  get minCombatRadius() {
    if (!this.hasPlanes) {
      return 0
    }
    return Math.min(...this.nonNullableEquipments.map(equip => equip.radius))
  }

  get combatRadius() {
    if (!this.hasPlanes) {
      return 0
    }
    const { minCombatRadius, nonNullableEquipments } = this
    const maxReconRadius = Math.max(
      ...nonNullableEquipments.map(({ radius, category }) => {
        if (category.isReconnaissanceAircraft) {
          return radius
        }
        return 0
      })
    )

    if (maxReconRadius > 0) {
      const reconBonus = Math.min(Math.sqrt(maxReconRadius - minCombatRadius), 3)
      return Math.round(minCombatRadius + reconBonus)
    }
    return minCombatRadius
  }
}
