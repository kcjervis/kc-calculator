import { Formation, Side } from '../../constants'
import { IEquipment } from '../../objects'

interface INightContactState {
  powerModifier: number
  accuracyModifier: number
  criticalHitRateModifier: number
}

export interface ISidedNightCombatState {
  side: Side
  formation: Formation
  searchlight: boolean
  starshell: boolean
  contact?: INightContactState
}
