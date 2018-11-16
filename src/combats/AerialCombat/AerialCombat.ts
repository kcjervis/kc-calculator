import random from 'lodash/random'

import { AirControlState, Side } from '../../constants'
import AntiAirCutIn from '../../data/AntiAirCutIn'
import { IOperation, IPlane, IShip } from '../../objects'
import BattleType from '../BattleType'
import { ICombatInformation } from '../CombatInformation'

export default abstract class AerialCombat {
  constructor(readonly combatInformation: ICombatInformation) {}

  public abstract operationToFighterCombatPlanes(operation: IOperation): IPlane[]

  public execution() {
    const { playerInformation, enemyInformation } = this.combatInformation

    const playerPlanes = this.operationToFighterCombatPlanes(playerInformation.operation)
    const enemyPlanes = this.operationToFighterCombatPlanes(enemyInformation.operation)

    // stage1
    const airControlState = this.fighterCombat(playerPlanes, enemyPlanes)

    // stage2

    const playerAirstrikePlanes = playerPlanes.filter(plane => plane.slotSize > 0 && plane.canParticipateInAirstrike)
    const enemyAirstrikePlanes = enemyPlanes.filter(plane => plane.slotSize > 0 && plane.canParticipateInAirstrike)

    this.stage2(playerAirstrikePlanes, enemyAirstrikePlanes)

    return {
      airControlState
    }
  }

  public abstract stage2(playerAirstrikePlanes: IPlane[], enemyAirstrikePlanes: IPlane[]): void

  public fighterCombat(playerPlanes: IPlane[], enemyPlanes: IPlane[]) {
    const playerFp = playerPlanes.reduce((value, plane) => value + plane.fighterPower, 0)
    const enemyFp = enemyPlanes.reduce((value, plane) => value + plane.fighterPower, 0)

    const airControlState = AirControlState.fromFighterPower(playerFp, enemyFp)

    playerPlanes.forEach(plane => this.shotdownInFighterCombat(plane, airControlState.constant, Side.Player))
    enemyPlanes.forEach(plane => this.shotdownInFighterCombat(plane, airControlState.constant, Side.Enemy))

    return airControlState
  }

  protected operationToShips({ mainFleet, escortFleet, isCombinedFleetOperation }: IOperation) {
    const ships = mainFleet.ships.concat()
    if (isCombinedFleetOperation && escortFleet) {
      ships.push(...escortFleet.ships)
    }
    return ships.filter((ship): ship is IShip => ship !== undefined)
  }

  protected antiAirDefense(
    ships: IShip[],
    airstrikePlanes: IPlane[],
    fleetAntiAir: number,
    antiAirCutIn?: AntiAirCutIn
  ) {
    const { battleType } = this.combatInformation
    for (const plane of airstrikePlanes) {
      const ship = ships[random(ships.length - 1)]
      shipAntiAirDefense(ship, plane, battleType, fleetAntiAir, antiAirCutIn)
    }
  }

  private shotdownInFighterCombat(plane: IPlane, airControlStateConstant: number, side: Side) {
    let randomValue: number
    if (side === Side.Player) {
      const minNum = airControlStateConstant / 4
      const maxRandomValue = Math.floor(Math.sqrt((airControlStateConstant / 3) * 100))
      randomValue = Math.floor(Math.random() * (maxRandomValue + 1)) / 100 + minNum
    } else {
      const maxRandomValue = 11 - airControlStateConstant
      randomValue =
        0.35 * Math.floor(Math.random() * (maxRandomValue + 1)) +
        0.65 * Math.floor(Math.random() * (maxRandomValue + 1))
    }
    const proportional = randomValue / 10
    const shotdownNum = Math.floor(plane.slotSize * proportional)
    if (plane.category.isJetPoweredAircraft) {
      plane.shotdown(shotdownNum * 0.6)
    } else {
      plane.shotdown(shotdownNum)
    }
  }
}

const shipAntiAirDefense = (
  ship: IShip,
  airstrikePlane: IPlane,
  battleType: BattleType,
  fleetAntiAir: number,
  antiAirCutIn: AntiAirCutIn | undefined
) => {
  let shotdownNumber = 0
  // 割合撃墜
  if (Math.random() > 0.5) {
    const proportional = ship.aerialCombat.calculateProportionalShotdownRate(battleType)
    shotdownNumber += Math.floor(airstrikePlane.slotSize * proportional)
  }
  // 固定撃墜
  if (Math.random() > 0.5) {
    shotdownNumber += ship.aerialCombat.calculateFixedShotdownNumber(battleType, fleetAntiAir, antiAirCutIn)
  }

  if (antiAirCutIn) {
    shotdownNumber += antiAirCutIn.minimumBonus
  } else if (ship.fleetInformation.side === Side.Player) {
    // 味方最低保証1
    shotdownNumber += 1
  }

  airstrikePlane.shotdown(shotdownNumber)
}
