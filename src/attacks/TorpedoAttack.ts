import { FunctionalModifier, createAttackPower, createHitRate } from "../formulas"
import { ShipInformation } from "../types"
import { Engagement, Formation, FleetType, Side } from "../constants"
import { Damage } from "../Battle"
import { IShip } from "../objects"
import TorpedoAttackStatus from "./TorpedoAttackStatus"

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

const isPossible = (attacker: IShip, defender: IShip) => {
  if (attacker.nakedStats.torpedo === 0) {
    return false
  }
  if (defender.isInstallation) {
    return false
  }
  return true
}

export default class TorpedoAttack {
  public static readonly cap = 150
  public static readonly criticalRateConstant = 1.5

  public static isPossible = isPossible

  public attacker: ShipInformation
  public defender: ShipInformation
  public engagement: Engagement
  public isCritical: boolean
  public remainingAmmoModifier: number
  public innateTorpedoAccuracy: number

  private attackerStatus: TorpedoAttackStatus

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

    this.attackerStatus = new TorpedoAttackStatus(attacker.ship)
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

  private getPowerModifiers = () => {
    const { attacker, engagement } = this
    const formationModifier = this.getFormationModifiers().attacker.power
    const engagementModifier = engagement.modifier
    const healthModifier = attacker.ship.health.torpedoPowerModifire

    const a14 = formationModifier * engagementModifier * healthModifier
    return { a14 }
  }

  private getPreCriticalPower = () => {
    const fleetFactor = this.getFleetFactor()
    const modifiers = this.getPowerModifiers()
    return this.attackerStatus.createPreCriticalPower({ fleetFactor, modifiers })
  }

  get power() {
    const { isCritical } = this
    const preCriticalPower = this.getPreCriticalPower()

    if (!isCritical) {
      return preCriticalPower
    }
    const postcap = Math.floor(preCriticalPower.postcap * 1.5)
    return { ...preCriticalPower, postcap, preCritical: preCriticalPower.precap }
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

    return Math.floor(
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
