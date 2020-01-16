import { ShipInformation, BattleState } from "../types"

import { getShellingFleetFactor, getShellingAccuracyFleetFactor } from "./FleetFactor"
import Damage from "./Damage"
import { createHitRate } from "../formulas"
import { Side, Formation } from "../constants"
import ShipShellingCalculator from "./ShipShellingCalculator"
import DayCombatSpecialAttack from "./DayCombatSpecialAttack"
import { AttackPowerModifierRecord, composeAttackPowerModifierRecord } from "../common"

type ShellingAttackParams = {
  battleState: BattleState
  attacker: ShipInformation
  defender: ShipInformation
  specialAttack?: DayCombatSpecialAttack
  isCritical?: boolean
  remainingAmmoModifier?: number
  fitGunBonus?: number
  optionalPowerModifiers?: AttackPowerModifierRecord
}

export default class ShellingAttack {
  public static criticalRateMultiplier = 1.3

  private battleState: BattleState
  private attacker: ShipInformation
  private defender: ShipInformation

  private specialAttack?: DayCombatSpecialAttack
  private isCritical?: boolean
  private remainingAmmoModifier?: number
  private fitGunBonus?: number
  private optionalPowerModifiers?: AttackPowerModifierRecord

  private attackCalculator: ShipShellingCalculator

  constructor({
    battleState,
    attacker,
    defender,
    specialAttack,
    isCritical,
    remainingAmmoModifier,
    fitGunBonus,
    optionalPowerModifiers
  }: ShellingAttackParams) {
    this.battleState = battleState
    this.attacker = attacker
    this.defender = defender
    this.specialAttack = specialAttack
    this.isCritical = isCritical
    this.remainingAmmoModifier = remainingAmmoModifier
    this.fitGunBonus = fitGunBonus
    this.optionalPowerModifiers = optionalPowerModifiers
    this.attackCalculator = new ShipShellingCalculator(attacker.ship)
  }

  get isArmorPiercing() {
    const defenderType = this.defender.ship.shipType
    return (
      defenderType.isBattleshipClass ||
      defenderType.isHeavyCruiserClass ||
      defenderType.any("AircraftCarrier", "ArmoredAircraftCarrier")
    )
  }

  get proficiencyModifiers() {
    return this.attackCalculator.getProficiencyModifiers(this.specialAttack?.isCarrierSpecialAttack)
  }

  private get fleetFactors() {
    const { attacker, defender } = this
    const power = getShellingFleetFactor(attacker, defender)
    const accuracy = getShellingAccuracyFleetFactor(attacker)
    return { power, accuracy }
  }

  get power() {
    const {
      battleState,
      attacker,
      defender,

      fleetFactors,
      specialAttack,
      isCritical,
      isArmorPiercing,
      optionalPowerModifiers
    } = this

    const { engagement } = battleState
    const { role, formation } = attacker

    const formationModifier = formation.getModifiersWithRole(role).shelling.power
    const engagementModifier = engagement.modifier

    const specialEnemyModifiers = attacker.ship.getSpecialEnemyModifiers(defender.ship)
    const isAntiInstallation = defender.ship.isInstallation

    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalPowerModifiers)

    return this.attackCalculator.calcPower({
      formationModifier,
      engagementModifier,
      modifiers,
      fleetFactor: fleetFactors.power,
      isCritical,
      isAntiInstallation,
      isArmorPiercing,
      specialAttack
    })
  }

  get accuracy() {
    const { attacker, defender, fleetFactors, isArmorPiercing, specialAttack, fitGunBonus = 0 } = this

    let formationModifier = attacker.formation.getModifiersWithRole(attacker.role).shelling.accuracy
    if (Formation.isIneffective(attacker.formation, defender.formation)) {
      formationModifier = 1
    }

    const specialAttackModifier = specialAttack ? specialAttack.modifier.accuracy : 1

    return this.attackCalculator.calcAccuracy({
      fleetFactor: fleetFactors.accuracy,
      formationModifier,
      specialAttackModifier,
      isArmorPiercing,
      fitGunBonus
    })
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
      accuracy: accuracy,
      evasion: defenderEvasionValue,
      moraleModifier,

      criticalRateMultiplier: ShellingAttack.criticalRateMultiplier,
      hitRateBonus: this.proficiencyModifiers.hitRate,
      criticalRateBonus: this.proficiencyModifiers.criticalRate
    })
  }

  get defensePower() {
    return this.defender.ship.getDefensePower()
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.postcap, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }

  get taihaRate() {
    const { damage, defender, hitRate, isCritical } = this
    const { currentHp, maxHp } = defender.ship.health
    const { side } = defender

    const isTaihaDamage = (value: number) => (currentHp - value) / maxHp <= 0.25
    const calcTaihaRate = (damageValues: number[]) => {
      if (damageValues.length === 0) {
        return 0
      }
      return damageValues.filter(isTaihaDamage).length / damageValues.length
    }

    const { scratchDamageProbability, scratchDamages, deadlyDamageProbability, stopperDamages } = damage
    const stopperDamageProbability = side === Side.Player ? deadlyDamageProbability : 0

    const normalDamages = damage.values.filter(value => {
      if (value <= 0) {
        return false
      }
      if (side === Side.Player && currentHp - value <= 0) {
        return false
      }
      return true
    })
    const normalDamageProbability = normalDamages.length / damage.values.length

    const taihaDamageRate =
      normalDamageProbability * calcTaihaRate(normalDamages) +
      scratchDamageProbability * calcTaihaRate(scratchDamages) +
      stopperDamageProbability * calcTaihaRate(stopperDamages)

    if (isCritical) {
      return hitRate.criticalRate * taihaDamageRate
    }
    return hitRate.normalHitRate * taihaDamageRate
  }

  get can() {
    const { attacker, defender } = this
    const defenderIsInstallation = defender.ship.isInstallation
    const { type } = this.attackCalculator

    const { ship } = attacker

    if (ship.health.damage === "Sunk") {
      return false
    }

    if (defender.ship.shipType.isSubmarineClass) {
      return false
    }

    if (type === "CarrierShelling") {
      if (ship.health.lte("Taiha")) {
        return false
      }

      if (!ship.shipType.is("ArmoredAircraftCarrier") && ship.health.lte("Chuuha")) {
        return false
      }

      const planes = ship.planes.filter(plane => plane.slotSize > 0)

      if (
        defenderIsInstallation &&
        planes.some(plane => plane.is("DiveBomber") && !plane.is("AntiInstallationBomber"))
      ) {
        return false
      }

      return ship.planes.some(plane => plane.participatesInCarrierShelling)
    }

    if (ship.shipType.isSubmarineClass && defenderIsInstallation) {
      return ship.hasGear("SpecialAmphibiousTank")
    }

    return true
  }
}
