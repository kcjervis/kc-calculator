import { Formation, Side } from "../../constants"

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
