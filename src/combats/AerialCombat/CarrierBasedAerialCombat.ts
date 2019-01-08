import { IShip } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

import AerialCombat from './AerialCombat'

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

    const playerPlanes = playerAntiAirDefenseShips.flatMap(({ planes }) => planes)
    const enemyPlanes = enemyAntiAirDefenseShips.flatMap(({ planes }) => planes)

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
    this.antiAirDefense(playerAntiAirDefenseShips, enemyAirstrikePlanes, player.tryAntiAirCutin())
    this.antiAirDefense(enemyAntiAirDefenseShips, playerAirstrikePlanes, enemy.tryAntiAirCutin())

    return {
      airControlState
    }
  }
}
