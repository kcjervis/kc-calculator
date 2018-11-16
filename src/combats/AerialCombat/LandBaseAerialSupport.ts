import { IOperation, IPlane } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

import { Side } from '../../constants'
import AerialCombat from './AerialCombat'

export default class LandBaseAerialSupport extends AerialCombat {
  constructor(combatInformation: ICombatInformation, private readonly airCorpsIndex: number) {
    super(combatInformation)
  }

  public stage2(playerAirstrikePlanes: IPlane[]) {
    const { operation, fleetAntiAir } = this.combatInformation.enemyInformation
    const enemyShips = this.operationToShips(operation)
    this.antiAirDefense(enemyShips, playerAirstrikePlanes, fleetAntiAir)
  }

  public operationToFighterCombatPlanes(operation: IOperation) {
    const planes = new Array<IPlane>()
    if (operation.side === Side.Player) {
      planes.push(...operation.landBase[this.airCorpsIndex].planes)
    } else {
      const { mainFleet, escortFleet } = operation
      planes.push(...mainFleet.planes)
      if (escortFleet) {
        planes.push(...escortFleet.planes)
      }
    }

    return planes.filter(plane => this.canParticipateInFighterCombat(plane))
  }

  private canParticipateInFighterCombat(plane: IPlane) {
    const { slotSize, category } = plane
    if (slotSize === 0) {
      return false
    }
    // 偵察機も参加する
    if (category.isFighter || category.isDiveBomber || category.isTorpedoBomber || category.isReconnaissanceAircraft) {
      return true
    }
    return false
  }
}
