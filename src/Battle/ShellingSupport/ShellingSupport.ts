import { ShipInformation, ShellingType, InstallationType, BattleState } from "../../types"

import Damage from "../Damage"
import { calcEvasionValue } from "../Evasion"
import { calcHitRate } from "../Hit"
import { calcBasicPower, calcPreCapPower, calcPower } from "../Shelling/ShellingPower"
import ShipShellingStatus from "../Shelling/ShipShellingStatus"
import { softcap } from "../../utils"
import { calcShellingBasicAccuracy, calcShellingAccuracy } from "../Shelling/ShellingAccuracy"
import { Formation } from "../../constants"

type ShellingSupportPowerDef = {
  battleState: BattleState
  attacker: ShipInformation
  isCritical?: boolean
  eventMapModifier?: number
}

export default class ShellingSupport {
  public static getShellingSupportPower = ({
    battleState,
    attacker,
    isCritical,
    eventMapModifier = 1
  }: ShellingSupportPowerDef) => {
    const { formation, role, ship } = attacker

    const { shellingType, firepower, torpedo, bombing, healthModifier } = new ShipShellingStatus(ship)

    let formationModifier = formation.getModifiersWithRole(role).shelling.power
    if (Formation.combinedFleetFormations.includes(formation)) {
      formationModifier = 1
    }
    if (Formation.Vanguard === formation) {
      formationModifier = 0.5
    }

    const engagementModifier = battleState.engagement.modifier

    const criticalModifier = isCritical ? 1.5 : 1

    const basicPower = calcBasicPower({
      shellingType,
      combinedFleetFactor: -1,
      firepower,
      torpedo,
      bombing,
      improvementModifier: 0
    })

    const preCap = calcPreCapPower(basicPower, {
      formationModifier,
      engagementModifier,
      healthModifier,
      antiInstallationModifiers: {
        shipTypeAdditive: 0,
        multiplicative: 1,
        additive: 0
      },
      cruiserFitBonus: 0
    })

    const cap = 150
    const isCapped = preCap > cap
    const capped = softcap(cap, preCap)

    const value = calcPower(capped, {
      effectivenessAdditive: 0,
      effectivenessMultiplicative: 1,
      specialAttackModifier: 1,
      apShellModifier: 1,
      criticalModifier,
      proficiencyModifier: 1,
      eventMapModifier
    })

    return { basicPower, preCap, isCapped, capped, value }
  }

  constructor(
    public battleState: BattleState,
    public attacker: ShipInformation,
    public defender: ShipInformation,

    public isCritical?: boolean,

    public eventMapModifier = 1,
    public remainingAmmoModifier = 1
  ) {}

  get power() {
    return ShellingSupport.getShellingSupportPower(this)
  }

  get accuracy() {
    const { attacker } = this
    const { ship, formation, role } = attacker
    const { level, stats, totalEquipmentStats } = ship

    const formationModifier = formation.getModifiersWithRole(role).shelling.accuracy
    const moraleModifier = ship.morale.shellingAccuracyModifier

    const equipmentAccuracy = totalEquipmentStats("accuracy")

    const base = calcShellingBasicAccuracy({
      combinedFleetFactor: -26,
      level,
      luck: stats.luck,
      equipmentAccuracy,
      improvementModifier: 0
    })

    const value = calcShellingAccuracy(base, {
      formationModifier,
      moraleModifier,
      fitGunBonus: 0,
      specialAttackModifier: 1,
      apShellModifier: 1
    })
    return { value }
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).shelling.evasion
    return calcEvasionValue(ship, formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue } = this
    const moraleModifier = defender.ship.morale.evasionModifier

    return calcHitRate(accuracy.value, defenderEvasionValue, moraleModifier, 0)
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.value, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
