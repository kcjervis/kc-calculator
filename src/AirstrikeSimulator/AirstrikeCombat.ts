import { IFleet, IPlane } from "../objects"
import Airstrike from "./Airstrike"
import { Formation } from "../common"
import { sample } from "../utils"

export default class AirstrikeCombat {
  public static isAirstrikePlane = (plane: IPlane) =>
    plane.slotSize > 0 && (plane.is("TorpedoBomber") || plane.is("DiveBomber"))

  constructor(
    private playerFleet: IFleet,
    private enemyFleet: IFleet,
    private enemyFormation: Formation,
    private contactModifier: number
  ) {}

  private getTarget = () => {
    const ships = this.enemyFleet.nonNullableShips
    const target = sample(ships)
    const flagship = ships[0]

    if (target !== flagship) {
      return target
    }

    const protects = Math.random() < this.enemyFormation.protectionRate
    if (!protects) {
      return target
    }

    const protectiveShips = ships.filter(
      ship => ship !== target && !ship.isInstallation && ship.health.damage === "Less"
    )

    if (protectiveShips.length === 0) {
      return target
    }

    return sample(protectiveShips)
  }

  public do = () => {
    const { playerFleet, contactModifier } = this

    playerFleet.nonNullableShips.forEach(ship => {
      const proficiencyModifiers = ship.getNormalProficiencyModifiers()

      const attackers = ship.planes.filter(AirstrikeCombat.isAirstrikePlane)

      const doAirstrike = (plane: IPlane) => {
        const target = this.getTarget()
        const airstrike = new Airstrike({
          plane,
          target,
          contactModifier,
          proficiencyModifiers
        })

        airstrike.do()
      }

      attackers.forEach(doAirstrike)
    })
  }
}
