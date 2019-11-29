import { FunctionalModifier, createAttackPower, createHitRate } from "../formulas"
import { ShipInformation } from "../types"
import { Engagement, Formation, FleetType, Side } from "../constants"
import { Damage } from "../Battle"

type TorpedoBasicPowerFactors = {
  torpedo: number
  fleetFactor: number
  improvementModifier: number
}
const calcBasicPower = ({ torpedo, improvementModifier, fleetFactor }: TorpedoBasicPowerFactors) => {
  return torpedo + improvementModifier + fleetFactor
}

type TorpedoPowerFactors = {
  formationModifier: number
  engagementModifier: number
  healthModifier: number

  additionalFm?: FunctionalModifier
}

type TorpedoAttackParams = {
  attacker: ShipInformation
  defender: ShipInformation
  engagement: Engagement
  isCritical: boolean

  remainingAmmoModifier?: number
  innateTorpedoAccuracy?: number
}

export default class TorpedoAttack {
  public static readonly cap = 150
  public static readonly criticalRateConstant = 1.5

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public remainingAmmoModifier: number
  public innateTorpedoAccuracy: number

  constructor({
    attacker,
    defender,
    engagement,
    isCritical = false,
    remainingAmmoModifier = 1,
    innateTorpedoAccuracy = 0
  }: TorpedoAttackParams) {
    this.attacker = attacker
    this.defender = defender
    this.engagement = engagement
    this.isCritical = isCritical
    this.remainingAmmoModifier = remainingAmmoModifier
    this.innateTorpedoAccuracy = innateTorpedoAccuracy
  }

  private getFleetTypeBySide = (side: Side) => {
    const { attacker, defender } = this
    return attacker.side === side ? attacker.fleetType : defender.fleetType
  }

  private getFleetFactor = () => {
    const playerFleetIsCombined = this.getFleetTypeBySide(Side.Player).isCombined
    const enemyFleetIsCombined = this.getFleetTypeBySide(Side.Enemy).isCombined

    const singleFleetFactor = 5
    if (!playerFleetIsCombined && !enemyFleetIsCombined) {
      return singleFleetFactor
    }
    if (playerFleetIsCombined && !enemyFleetIsCombined) {
      return singleFleetFactor - 5
    }
    return singleFleetFactor + 10
  }

  private getFormationModifiers = () => {
    const { attacker, defender } = this
    return {
      attacker: attacker.formation.getModifiersWithRole(attacker.role).torpedo,
      defender: defender.formation.getModifiersWithRole(defender.role).torpedo
    }
  }

  private getBasicPowerFactors = () => {
    const { ship } = this.attacker
    const fleetFactor = this.getFleetFactor()
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.torpedoPowerModifier)
    return { torpedo: ship.stats.torpedo, fleetFactor, improvementModifier }
  }

  private getPowerModifiers = () => {
    const { attacker, engagement } = this
    const formationModifier = this.getFormationModifiers().attacker.power
    const engagementModifier = engagement.modifier
    const healthModifier = attacker.ship.health.torpedoPowerModifire

    const a14 = formationModifier * engagementModifier * healthModifier
    return { a14 }
  }

  private calcBasicPower = () => {
    return calcBasicPower(this.getBasicPowerFactors())
  }

  private getPreCriticalPower = () => {
    const basic = this.calcBasicPower()
    const cap = TorpedoAttack.cap
    const modifiers = this.getPowerModifiers()
    return createAttackPower({ basic, cap, modifiers })
  }

  get power() {
    const { isCritical } = this
    const preCriticalPower = this.getPreCriticalPower()

    if (!isCritical) {
      return preCriticalPower
    }
    const postcap = Math.floor(preCriticalPower.postcap * 1.5)
    return { ...preCriticalPower, postcap }
  }

  get accuracy() {
    const { ship } = this.attacker
    const { luck, level } = ship.nakedStats

    const constant = 85
    const shipAccuracy = 1.5 * Math.sqrt(luck) + 2 * Math.sqrt(level)
    const equipmentAccuracy = ship.totalEquipmentStats("accuracy")
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.torpedoAccuracyModifier)
    const powerModifier = Math.floor(0.2 * this.getPreCriticalPower().postcap)
    const { innateTorpedoAccuracy } = this

    const formationModifier = this.getFormationModifiers().attacker.accuracy
    const moraleModifier = ship.morale.getAccuracyModifier("torpedo")

    return (
      (constant + shipAccuracy + equipmentAccuracy + improvementModifier + powerModifier + innateTorpedoAccuracy) *
      formationModifier *
      moraleModifier
    )
  }

  get evasion() {
    const { ship } = this.defender
    const formationModifier = this.getFormationModifiers().defender.evasion
    const sonarImprovementBonus = ship.totalEquipmentStats(gear => {
      if (gear.is("Sonar") || gear.is("LargeSonar")) {
        return 0
      }
      return 1.5 * Math.sqrt(gear.star)
    })
    return ship.calcEvasionValue(formationModifier, sonarImprovementBonus)
  }

  get hitRate() {
    const { accuracy, defender, evasion } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    const criticalRateConstant = TorpedoAttack.criticalRateConstant
    return createHitRate({ accuracy, evasion, moraleModifier, criticalRateConstant })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
