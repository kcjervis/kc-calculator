import { IPlane, IShip } from "../objects"
import { createAttackPower, FunctionalModifier, createCriticalFm } from "../common"
import { Damage } from "../attacks"
import { createHitRate, getHitStatus } from "../formulas"

type ProficiencyModifiers = {
  power: number
  hitRate: number
  criticalRate: number
}

type Params = {
  plane: IPlane
  target: IShip
  contactModifier: number
  proficiencyModifiers: ProficiencyModifiers
}

export default class Airstrike {
  private plane: IPlane
  private target: IShip
  private contactModifier: number
  private proficiencyModifiers: ProficiencyModifiers

  constructor({ plane, target, contactModifier, proficiencyModifiers }: Params) {
    this.plane = plane
    this.target = target
    this.contactModifier = contactModifier
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

  private get typeModifier() {
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

  private calcPower = (isCritical: boolean) => {
    const { slotSize, stat, typeModifier, contactModifier, proficiencyModifiers } = this
    const fleetFactor = 0

    const basic = typeModifier * (stat * Math.sqrt(slotSize) + fleetFactor)
    const cap = 170

    const modifiers = { a11: contactModifier }

    const fm11next = isCritical ? createCriticalFm(proficiencyModifiers.power) : undefined

    return createAttackPower({ basic, cap, modifiers, fm11next })
  }

  private get accuracy() {
    return 95
  }

  private get evasion() {
    return this.target.calcEvasionValue(1)
  }

  public getHitRate = () => {
    const { accuracy, evasion, proficiencyModifiers, target } = this
    const moraleModifier = target.morale.evasionModifier
    const hitRateBonus = proficiencyModifiers.hitRate
    const criticalRateMultiplier = 0.2
    const criticalRateBonus = proficiencyModifiers.criticalRate

    return createHitRate({
      accuracy,
      evasion,
      moraleModifier,

      hitRateBonus,
      criticalRateMultiplier,
      criticalRateBonus
    })
  }

  public getDamage = (isCritical: boolean) => {
    const { target } = this
    const { postcap } = this.calcPower(isCritical)
    return new Damage(postcap, target.getDefensePower(), target.health.currentHp)
  }

  public do = () => {
    const hitRate = this.getHitRate()
    const hitStatus = getHitStatus(hitRate)
    if (hitStatus === "Miss") {
      return
    }

    const damage = this.getDamage(hitStatus === "Critical")
    this.target.health.currentHp -= damage.random()
  }
}
