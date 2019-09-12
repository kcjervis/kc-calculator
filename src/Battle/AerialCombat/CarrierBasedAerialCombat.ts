import { IShip, IPlane } from "../../objects"
import { ICombatInformation } from "../CombatInformation"

import AerialCombat from "./AerialCombat"
import AntiAirCutin from "./AntiAirCutin"

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

    const participates = (plane: IPlane) => plane.is("DiveBomber") || plane.is("TorpedoBomber") || plane.is("Fighter")
    const playerFighterCombatPlanes = playerPlanes.filter(participates)
    const enemyFighterCombatPlanes = enemyPlanes.filter(participates)

    // stage1
    const airControlState = this.fighterCombat(playerFighterCombatPlanes, enemyFighterCombatPlanes)

    // stage2
    const { player, enemy } = combatInformation
    const playerAirstrikePlanes = playerFighterCombatPlanes.filter(
      plane => plane.slotSize > 0 && plane.participatesInAirstrike
    )
    const enemyAirstrikePlanes = enemyFighterCombatPlanes.filter(
      plane => plane.slotSize > 0 && plane.participatesInAirstrike
    )

    this.antiAirDefense(playerAntiAirDefenseShips, enemyAirstrikePlanes, AntiAirCutin.try(player.allShips))
    this.antiAirDefense(enemyAntiAirDefenseShips, playerAirstrikePlanes, AntiAirCutin.try(player.allShips))

    return {
      airControlState
    }
  }
}
