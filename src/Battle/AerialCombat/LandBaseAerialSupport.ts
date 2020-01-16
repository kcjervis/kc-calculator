import { flatMap } from "lodash-es"

import { AirControlState, Side } from "../../common"
import { ILandBasedAirCorps, IPlane } from "../../objects"
import { ICombatInformation } from "../CombatInformation"

import AerialCombat from "./AerialCombat"

export default class LandBaseAerialSupport extends AerialCombat {
  constructor(combatInformation: ICombatInformation, private readonly landBasedAirCorps: ILandBasedAirCorps) {
    super(combatInformation)
  }

  public main() {
    const { enemy } = this.combatInformation

    // stage1
    const { fighterPower: playerFp, planes: playerPlanes } = this.landBasedAirCorps

    const enemyPlanes = flatMap(enemy.allShips, ({ planes }) => planes)
    const enemyFp = enemyPlanes.reduce((value, plane) => value + plane.fighterPower, 0)

    const airControlState = AirControlState.fromFighterPower(playerFp, enemyFp)

    const participates = (plane: IPlane) =>
      plane.is("DiveBomber") || plane.is("TorpedoBomber") || plane.is("Fighter") || plane.is("ReconnaissanceAircraft")
    const playerFighterCombatPlanes = playerPlanes.filter(participates)
    const enemyFighterCombatPlanes = enemyPlanes.filter(participates)

    playerFighterCombatPlanes.forEach(plane =>
      this.shotdownInFighterCombat(plane, airControlState.constant, Side.Player)
    )
    enemyFighterCombatPlanes.forEach(plane => this.shotdownInFighterCombat(plane, airControlState.constant, Side.Enemy))

    // stage2
    const playerAirstrikePlanes = playerFighterCombatPlanes.filter(
      plane => plane.slotSize > 0 && plane.participatesInAirstrike
    )
    this.antiAirDefense(enemy.allShips, playerAirstrikePlanes)

    return {
      airControlState
    }
  }
}
