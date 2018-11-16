import { Formation } from '../constants'
import { IOperation } from '../objects'

import BattleType from './BattleType'

export interface ICombatFleetInformation {
  operation: IOperation

  fleetAntiAir: number
  formation: Formation
}

export interface ICombatInformation {
  playerInformation: ICombatFleetInformation
  enemyInformation: ICombatFleetInformation

  battleType: BattleType
}
