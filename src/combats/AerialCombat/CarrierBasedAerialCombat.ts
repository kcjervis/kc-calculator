import maxBy from 'lodash/maxBy'
import random from 'lodash/random'

import { IOperation, IPlane, IShip } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

import AntiAirCutIn from '../../data/AntiAirCutIn'
import AerialCombat from './AerialCombat'

/**
 * 艦隊同士の航空戦
 */
export default class CarrierBasedAerialCombat extends AerialCombat {
  private readonly isBothCombinedFleetOperation: boolean

  constructor(combatInformation: ICombatInformation) {
    super(combatInformation)
    const { playerInformation, enemyInformation } = combatInformation
    this.isBothCombinedFleetOperation =
      playerInformation.operation.isCombinedFleetOperation && enemyInformation.operation.isCombinedFleetOperation
  }

  public operationToFighterCombatPlanes({ mainFleet, escortFleet }: IOperation) {
    const planes = mainFleet.planes.concat()
    if (this.isBothCombinedFleetOperation && escortFleet) {
      planes.push(...escortFleet.planes.filter(this.canParticipateInFighterCombat))
    }
    return planes
  }

  public stage2(playerAirstrikePlanes: IPlane[], enemyAirstrikePlanes: IPlane[]) {
    const { playerInformation, enemyInformation } = this.combatInformation
    const playerShips = this.operationToShips(playerInformation.operation)
    const enemyShips = this.operationToShips(enemyInformation.operation)
    this.antiAirDefense(playerShips, enemyAirstrikePlanes, playerInformation.fleetAntiAir, tryAntiAirCutIn(playerShips))
    this.antiAirDefense(enemyShips, playerAirstrikePlanes, enemyInformation.fleetAntiAir, tryAntiAirCutIn(enemyShips))
  }

  private canParticipateInFighterCombat(plane: IPlane) {
    const { slotSize, category } = plane
    if (slotSize === 0) {
      return false
    }
    if (category.isFighter || category.isDiveBomber || category.isTorpedoBomber) {
      return true
    }
    return false
  }
}

const tryAntiAirCutIn = (ships: IShip[]) => {
  const possibleAntiAirCutIns = new Array<AntiAirCutIn>()
  ships.forEach(ship => {
    const randomNum = random(100)
    const shipAntiAirCutIn = ship.aerialCombat.possibleAntiAirCutIns.find(aaci => aaci.probability > randomNum)
    if (shipAntiAirCutIn) {
      possibleAntiAirCutIns.push(shipAntiAirCutIn)
    }
  })
  return maxBy(possibleAntiAirCutIns, aaci => aaci.api)
}
