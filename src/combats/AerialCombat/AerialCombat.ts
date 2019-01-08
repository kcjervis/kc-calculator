import random from 'lodash/random'

import { fixedShotdownNumber, getCombinedFleetModifier, proportionalShotdownRate } from '../../AerialCombat/antiAir'
import { AirControlState, Side } from '../../constants'
import AntiAirCutin from '../../data/AntiAirCutin'
import { IPlane, IShip } from '../../objects'
import { ICombatInformation } from '../CombatInformation'

export default abstract class AerialCombat {
  constructor(readonly combatInformation: ICombatInformation) {}

  public fighterCombat(playerPlanes: IPlane[], enemyPlanes: IPlane[]) {
    const playerFp = playerPlanes.reduce((value, plane) => value + plane.fighterPower, 0)
    const enemyFp = enemyPlanes.reduce((value, plane) => value + plane.fighterPower, 0)

    const airControlState = AirControlState.fromFighterPower(playerFp, enemyFp)

    playerPlanes.forEach(plane => this.shotdownInFighterCombat(plane, airControlState.constant, Side.Player))
    enemyPlanes.forEach(plane => this.shotdownInFighterCombat(plane, airControlState.constant, Side.Enemy))

    return airControlState
  }

  public antiAirDefense(ships: IShip[], airstrikePlanes: IPlane[], antiAirCutin?: AntiAirCutin) {
    for (const plane of airstrikePlanes) {
      const ship = ships[random(ships.length - 1)]
      this.shipAntiAirDefense(ship, plane, antiAirCutin)
    }
  }

  public shotdownInFighterCombat = (plane: IPlane, airControlStateConstant: number, side: Side) => {
    let randomValue: number
    if (side === Side.Player) {
      const minNum = airControlStateConstant / 4
      const maxRandomValue = Math.floor((airControlStateConstant / 3) * 100)
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

  private shipAntiAirDefense = (ship: IShip, airstrikePlane: IPlane, antiAirCutin?: AntiAirCutin) => {
    const { battleType } = this.combatInformation
    const { side: shipSide, fleetType, fleetRole, fleetAntiAir } = this.combatInformation.getShipInformation(ship)
    const combinedFleetModifier = getCombinedFleetModifier(battleType, fleetRole)

    let shotdownNumber = 0
    // 割合撃墜
    if (Math.random() > 0.5) {
      const proportional = proportionalShotdownRate(ship, shipSide, combinedFleetModifier)
      shotdownNumber += Math.floor(airstrikePlane.slotSize * proportional)
    }
    // 固定撃墜
    if (Math.random() > 0.5) {
      shotdownNumber += fixedShotdownNumber(ship, shipSide, fleetAntiAir, combinedFleetModifier)
    }

    if (antiAirCutin) {
      shotdownNumber += antiAirCutin.minimumBonus
    } else if (shipSide === Side.Player) {
      // 味方最低保証1
      shotdownNumber += 1
    }

    airstrikePlane.shotdown(shotdownNumber)
  }
}
