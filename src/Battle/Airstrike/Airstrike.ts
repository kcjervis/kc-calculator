import { IShip } from '../../objects'
import { getAirstrikePower } from './AirstrikePower'
import { sumBy } from 'lodash-es'
import { getProficiencyModifier } from '../Shelling/ShipShellingStatus'

export default class Airstrike {
  constructor(
    private attacker: IShip,
    private defender: IShip,
    private torpedoBomberModifier: number,
    public contactModifier = 1,
    private isCritical = false
  ) {}

  get proficiencyModifier() {
    return getProficiencyModifier(this.attacker)
  }

  get powers() {
    const { attacker, torpedoBomberModifier, contactModifier, isCritical } = this
    const criticalModifier = isCritical ? 1.5 : 1
    const proficiencyModifier = this.proficiencyModifier.power

    const planes = attacker.planes.filter(plane => {
      if (plane.slotSize <= 0) {
        return false
      }
      return plane.category.isTorpedoBomber || plane.category.isDiveBomber
    })

    return planes.map(plane => {
      let stat = 0
      let planeTypeModifier = 1
      if (plane.category.isTorpedoBomber) {
        stat = plane.gear.torpedo
        planeTypeModifier = torpedoBomberModifier
      }
      if (plane.category.isDiveBomber) {
        stat = plane.gear.bombing
        planeTypeModifier = 1
      }
      if (plane.category.is('JetPoweredFighterBomber')) {
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
