import { random } from "lodash-es"

import { AirControlState, Side } from "../../constants"
import { IPlane, IShip } from "../../objects"
import { ICombatInformation } from "../CombatInformation"
import ShipAntiAir from "./ShipAntiAir"
import FleetAntiAir from "./FleetAntiAir"
import AntiAirCutin from "./AntiAirCutin"

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
    if (plane.is("JetPoweredAircraft")) {
      plane.shotdown(shotdownNum * 0.6)
    } else {
      plane.shotdown(shotdownNum)
    }
  }

  private shipAntiAirDefense = (ship: IShip, airstrikePlane: IPlane, antiAirCutin?: AntiAirCutin) => {
    const { battleType } = this.combatInformation
    const { side: shipSide, fleetRole, fleetAntiAir } = this.combatInformation.getShipInformation(ship)
    const combinedFleetModifier = FleetAntiAir.getCombinedFleetModifier(fleetRole, battleType)
    const shipAntiAir = new ShipAntiAir(ship, shipSide, fleetAntiAir, combinedFleetModifier, antiAirCutin)

    let shotdownNumber = 0
    // 割合撃墜
    if (Math.random() > 0.5) {
      shotdownNumber += Math.floor(airstrikePlane.slotSize * shipAntiAir.calcProportionalShotdownRate())
    }
    // 固定撃墜
    if (Math.random() > 0.5) {
      shotdownNumber += shipAntiAir.calcFixedShotdownNumber()
    }
    // 最低保証
    shotdownNumber += shipAntiAir.minimumBonus

    airstrikePlane.shotdown(shotdownNumber)
  }
}
