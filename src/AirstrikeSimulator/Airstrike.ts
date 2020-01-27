import { IPlane, IShip } from "../objects"
import { createAttackPower, FunctionalModifier, createCriticalFm } from "../common"
import { Damage } from "../attacks"

type ProficiencyModifiers = {
  criticalPower: number
  hitRate: number
  criticalRate: number
}

type Params = {
  plane: IPlane
  target: IShip
  proficiencyModifiers: ProficiencyModifiers
}

export default class Airstrike {
  private plane: IPlane
  private target: IShip
  private proficiencyModifiers: ProficiencyModifiers

  constructor({ plane, target, proficiencyModifiers }: Params) {
    this.plane = plane
    this.target = target
    this.proficiencyModifiers = proficiencyModifiers
  }

  private get slotSize() {
    return this.plane.slotSize
  }

  private get type() {
    const { is } = this.plane
    if (is("JetPoweredFighterBomber")) {
      return "JetPoweredFighterBomber"
    }
    if (is("DiveBomber")) {
      return "DiveBomber"
    }
    if (is("TorpedoBomber")) {
      return "TorpedoBomber"
    }
    return "None"
  }

  private get stat() {
    const { plane } = this
    if (plane.is("DiveBomber")) {
      return plane.gear.bombing
    }
    if (plane.is("TorpedoBomber")) {
      return plane.gear.torpedo
    }
    return 0
  }

  private calcPower = (typeModifier: number, isCritical = false) => {
    const { slotSize, stat } = this
    const fleetFactor = 0

    const basic = typeModifier * (stat * Math.sqrt(slotSize) + fleetFactor)
    const cap = 150

    const fm11next = isCritical ? createCriticalFm() : undefined

    return createAttackPower({ basic, cap, modifiers: {}, fm11next })
  }

  private getTypeModifier = () => {
    const { type } = this
    if (type === "JetPoweredFighterBomber") {
      return 1 / Math.sqrt(2)
    }
    if (type === "DiveBomber") {
      return 1
    }
    if (type === "TorpedoBomber") {
      return Math.random() > 0.5 ? 0.8 : 1.5
    }
    return 0
  }

  public getDamage = () => {
    const { target } = this
    const typeModifier = this.getTypeModifier()
    const { postcap } = this.calcPower(typeModifier)
    return new Damage(postcap, target.getDefensePower(), target.health.currentHp)
  }
}
