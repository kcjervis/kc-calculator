import { flatMap } from 'lodash-es'

import { IShip } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

import AerialCombat from './AerialCombat'
import AntiAirCutin from './AntiAirCutin'

/**
 * 艦隊同士の航空戦
 */
export default class CarrierBasedAerialCombat extends AerialCombat {
  private playerAntiAirDefenseShips: IShip[]
  private enemyAntiAirDefenseShips: IShip[]

  constructor(combatInformation: ICombatInformation) {
    super(combatInformation)

    const { player, enemy } = this.combatInformation

    if (player.isCombinedFleet && enemy.isCombinedFleet) {
      this.playerAntiAirDefenseShips = player.allShips
      this.enemyAntiAirDefenseShips = enemy.allShips
    } else {
      this.playerAntiAirDefenseShips = player.mainFleet.nonNullableShips
      this.enemyAntiAirDefenseShips = enemy.mainFleet.nonNullableShips
    }
  }

  public main() {
    const { playerAntiAirDefenseShips, enemyAntiAirDefenseShips, combatInformation } = this

    const playerPlanes = flatMap(playerAntiAirDefenseShips, ({ planes }) => planes)

    const enemyPlanes = flatMap(enemyAntiAirDefenseShips, ({ planes }) => planes)

    const playerFighterCombatPlanes = playerPlanes.filter(plane => !plane.category.isReconnaissanceAircraft)
    const enemyFighterCombatPlanes = enemyPlanes.filter(plane => !plane.category.isReconnaissanceAircraft)

    // stage1
    const airControlState = this.fighterCombat(playerFighterCombatPlanes, enemyFighterCombatPlanes)

    // stage2
    const { player, enemy } = combatInformation
    const playerAirstrikePlanes = playerFighterCombatPlanes.filter(
      plane => plane.slotSize > 0 && plane.canParticipateInAirstrike
    )
    const enemyAirstrikePlanes = enemyFighterCombatPlanes.filter(
      plane => plane.slotSize > 0 && plane.canParticipateInAirstrike
    )

    this.antiAirDefense(playerAntiAirDefenseShips, enemyAirstrikePlanes, AntiAirCutin.try(player.allShips))
    this.antiAirDefense(enemyAntiAirDefenseShips, playerAirstrikePlanes, AntiAirCutin.try(player.allShips))

    return {
      airControlState
    }
  }
}
