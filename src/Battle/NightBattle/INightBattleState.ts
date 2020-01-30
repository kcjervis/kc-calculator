import { Formation } from "../../common"
import { Side } from "../../types"

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
