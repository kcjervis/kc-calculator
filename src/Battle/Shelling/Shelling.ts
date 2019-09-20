import DayCombatSpecialAttack from "./DayCombatSpecialAttack"
import {
  ShipInformation,
  InstallationType,
  BattleState,
  ShellingPowerFactors,
  ShellingAccuracyFactors
} from "../../types"

import getCombinedFleetFactor from "./getCombinedFleetFactor"
import Damage from "../Damage"
import { calcEvasionValue } from "../Evasion"
import { calcHitRate } from "../Hit"
import { Side, Formation } from "../../constants"
import ShellingPower from "./ShellingPower"
import ShellingAccuracy from "./ShellingAccuracy"

export default class Shelling {
  public static getCombinedFleetFactor = getCombinedFleetFactor
  constructor(
    public battleState: BattleState,
    public attacker: ShipInformation,
    public defender: ShipInformation,

    public specialAttack?: DayCombatSpecialAttack,
    public isCritical?: boolean,

    public eventMapModifier = 1,
    public remainingAmmoModifier = 1,
    public manualInstallationType?: InstallationType,
    public fitGunBonus = 0
  ) {}

  private get attackStats() {
    return this.attacker.ship.getShellingStats()
  }

  get isArmorPiercing() {
    const defenderType = this.defender.ship.shipType
    return (
      defenderType.isBattleshipClass ||
      defenderType.isHeavyCruiserClass ||
      defenderType.any("AircraftCarrier", "ArmoredAircraftCarrier")
    )
  }

  private get combinedFleetFactors() {
    const { attacker, defender } = this
    const power = getCombinedFleetFactor(attacker, defender)
    // accuracy 仮置き
    return { power, accuracy: 0 }
  }

  get proficiencyModifiers() {
    const { attacker, specialAttack } = this
    const { shellingType, normalProficiencyModifiers, specialProficiencyModifiers } = this.attackStats
    if (shellingType === "Shelling") {
      return { power: 1, hitRate: 0, criticalRate: 0 }
    }
    return specialAttack === undefined ? normalProficiencyModifiers : specialProficiencyModifiers
  }

  private getDefenderInstallationType() {
    const { defender, manualInstallationType } = this
    return manualInstallationType || defender.ship.installationType
  }

  get power() {
    const {
      battleState,
      attacker,
      isCritical,
      combinedFleetFactors,
      eventMapModifier,
      specialAttack,
      isArmorPiercing
    } = this

    const { engagement } = battleState
    const { role, formation } = attacker
    const combinedFleetFactor = combinedFleetFactors.power

    const installationType = this.getDefenderInstallationType()
    const {
      shellingType,
      firepower,
      torpedo,
      bombing,
      improvementModifiers,
      healthModifier,
      cruiserFitBonus,
      apShellModifiers
    } = this.attackStats

    const formationModifier = formation.getModifiersWithRole(role).shelling.power
    const engagementModifier = engagement.modifier

    const criticalModifier = isCritical ? 1.5 : 1

    const specialAttackModifier = specialAttack ? specialAttack.modifier.power : 1
    const apShellModifier = isArmorPiercing ? apShellModifiers.power : 1

    const antiInstallationStatus = attacker.ship.getAntiInstallationStatus()

    const antiInstallationModifiers = antiInstallationStatus.getModifiersFromType(installationType)
    const isAntiInstallationWarfare = installationType !== "None"

    const effectiveBombing = isAntiInstallationWarfare
      ? attacker.ship.totalEquipmentStats(gear => (gear.is("AntiInstallationBomber") ? gear.bombing : 0))
      : bombing

    const effectivenessMultiplicative = antiInstallationModifiers.postCapMultiplicative
    const effectivenessAdditive = 0

    const proficiencyModifier = this.proficiencyModifiers.power

    const factors: ShellingPowerFactors = {
      shellingType,
      combinedFleetFactor,
      firepower,
      torpedo: isAntiInstallationWarfare ? 0 : torpedo,
      bombing: effectiveBombing,
      improvementModifier: improvementModifiers.power,

      antiInstallationModifiers,
      formationModifier,
      engagementModifier,
      healthModifier,
      cruiserFitBonus,

      effectivenessMultiplicative,
      effectivenessAdditive,
      specialAttackModifier,
      apShellModifier,
      criticalModifier,
      proficiencyModifier,
      eventMapModifier
    }

    return new ShellingPower(factors)
  }

  get accuracy() {
    const { attacker, defender, combinedFleetFactors, isArmorPiercing, specialAttack, fitGunBonus } = this

    let formationModifier = attacker.formation.getModifiersWithRole(attacker.role).shelling.accuracy
    if (Formation.isIneffective(attacker.formation, defender.formation)) {
      formationModifier = 1
    }

    const { level, luck, accuracy, improvementModifiers, moraleModifier, apShellModifiers } = this.attackStats

    const specialAttackModifier = specialAttack ? specialAttack.modifier.accuracy : 1
    const apShellModifier = isArmorPiercing ? apShellModifiers.accuracy : 1

    const factors: ShellingAccuracyFactors = {
      combinedFleetFactor: combinedFleetFactors.accuracy,
      level,
      luck,
      equipmentAccuracy: accuracy,
      improvementModifier: improvementModifiers.accuracy,
      moraleModifier,
      formationModifier,
      fitGunBonus,
      specialAttackModifier,
      apShellModifier
    }

    return new ShellingAccuracy(factors)
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).shelling.evasion
    return calcEvasionValue(ship, formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue } = this
    const moraleModifier = defender.ship.morale.evasionModifier

    return calcHitRate(accuracy.value, defenderEvasionValue, moraleModifier, this.proficiencyModifiers.hitRate)
  }

  get criticalRate() {
    const { hitRate } = this
    const hitNumB = Math.floor(Math.sqrt(hitRate * 100) * 1.3)
    return (hitNumB + 1) / 100 + this.proficiencyModifiers.criticalRate
  }

  get defensePower() {
    return this.defender.ship.getDefensePower()
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = defender.ship.getDefensePower()
    return new Damage(power.value, defensePower, defender.ship.health.currentHp, remainingAmmoModifier)
  }

  get taihaRate() {
    const { damage, defender, hitRate, criticalRate, isCritical } = this
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
      return criticalRate * taihaDamageRate
    }
    return (hitRate - criticalRate) * taihaDamageRate
  }

  get can() {
    const { attacker, defender } = this
    const defenderIsInstallation = defender.ship.isInstallation
    const { shellingType } = this.attackStats

    const { ship } = attacker

    if (ship.health.damage === "Sunk") {
      return false
    }

    if (defender.ship.shipType.isSubmarineClass) {
      return false
    }

    if (shellingType === "CarrierShelling") {
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
