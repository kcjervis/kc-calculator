import { ILandBasedAirCorps } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

import AerialCombat from './AerialCombat'

export default class LandBaseAerialSupport extends AerialCombat {
  constructor(combatInformation: ICombatInformation, private readonly landBasedAirCorps: ILandBasedAirCorps) {
    super(combatInformation)
  }

  public main() {
    const { enemy } = this.combatInformation

    const playerPlanes = this.landBasedAirCorps.planes
    const enemyPlanes = enemy.allShips.flatMap(({ planes }) => planes)

    // stage1
    const airControlState = this.fighterCombat(playerPlanes, enemyPlanes)

    // stage2
    const playerAirstrikePlanes = playerPlanes.filter(plane => plane.slotSize > 0 && plane.canParticipateInAirstrike)
    this.antiAirDefense(enemy.allShips, playerAirstrikePlanes)

    return {
      airControlState
    }
  }
}
