import { ShipInformation, BattleState } from "../../types"

import { Damage } from "../../attacks"
import { createHitRate } from "../../formulas"
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
  // 改式だと1.1 実際いくつかわからない
  public static criticalRateMultiplier = 1.3
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

    const precap = calcPreCapPower(basicPower, {
      formationModifier,
      engagementModifier,
      healthModifier,
      antiInstallationModifiers: {
        b12: 0,
        a13: 1,
        b13: 0,
        a13next: 1,
        b13next: 0
      },
      cruiserFitBonus: 0
    })

    const cap = 150
    const isCapped = precap > cap
    const capped = softcap(cap, precap)

    const value = calcPower(capped, {
      effectivenessAdditive: 0,
      effectivenessMultiplicative: 1,
      specialAttackModifier: 1,
      apShellModifier: 1,
      criticalModifier,
      proficiencyModifier: 1,
      eventMapModifier
    })

    return { basicPower, precap, isCapped, capped, value }
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

    let formationModifier = formation.getModifiersWithRole(role).shelling.accuracy
    if (Formation.combinedFleetFormations.includes(formation)) {
      formationModifier = 1
    }
    if (Formation.Vanguard === formation) {
      formationModifier = 0.8
    }

    const moraleModifier = ship.morale.getAccuracyModifier("shelling")

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
    return ship.calcEvasionValue(formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue } = this
    const moraleModifier = defender.ship.morale.evasionModifier
    return createHitRate({
      accuracy: accuracy.value,
      evasion: defenderEvasionValue,
      moraleModifier,
      criticalRateMultiplier: ShellingSupport.criticalRateMultiplier
    })
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.value, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }
}
