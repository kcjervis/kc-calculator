import { IShip } from "../../objects"
import { getAirstrikePower } from "./AirstrikePower"

export default class Airstrike {
  constructor(
    private attacker: IShip,
    private defender: IShip,
    private torpedoBomberModifier: number,
    public contactModifier = 1,
    private isCritical = false
  ) {}

  get powers() {
    const { attacker, torpedoBomberModifier, contactModifier, isCritical } = this
    const criticalModifier = isCritical ? 1.5 : 1
    const proficiencyModifier = attacker.getNormalProficiencyModifiers().power

    const planes = attacker.planes.filter(plane => {
      if (plane.slotSize <= 0) {
        return false
      }
      return plane.is("TorpedoBomber") || plane.is("DiveBomber")
    })

    return planes.map(plane => {
      let stat = 0
      let planeTypeModifier = 1
      if (plane.is("TorpedoBomber")) {
        stat = plane.gear.torpedo
        planeTypeModifier = torpedoBomberModifier
      }
      if (plane.is("DiveBomber")) {
        stat = plane.gear.bombing
        planeTypeModifier = 1
      }
      if (plane.is("JetPoweredFighterBomber")) {
        planeTypeModifier = 1 / Math.sqrt(2)
      }
      getAirstrikePower({
        stat,
        planeCount: plane.slotSize,
        fleetConstant: 25,
        planeTypeModifier,
        antiInstallationModifier: 1,
        criticalModifier,
        proficiencyModifier,
        contactModifier
      })
    })
  }
}
