import DayCombatSpecialAttack from './DayCombatSpecialAttack'
import { ShipInformation, ShellingType, InstallationType, BattleState } from '../../types'

import ShipShellingStatus, { getProficiencyModifier } from './ShipShellingStatus'
import getCombinedFleetFactor from './getCombinedFleetFactor'
import Damage from '../Damage'
import DefensePower from '../DefensePower'
import { calcEvasionValue } from '../Evasion'
import { calcHitRate } from '../Hit'
import { Side } from '../../constants'

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

  get isArmorPiercing() {
    const defenderType = this.defender.ship.shipType
    return (
      defenderType.isBattleshipClass ||
      defenderType.isHeavyCruiserClass ||
      defenderType.either('AircraftCarrier', 'ArmoredAircraftCarrier')
    )
  }

  private get combinedFleetFactors() {
    const { attacker, defender } = this
    const power = getCombinedFleetFactor(attacker, defender)
    // accuracy 仮置き
    return { power, accuracy: 0 }
  }

  get attackerShellingStatus() {
    return new ShipShellingStatus(this.attacker.ship)
  }

  get shellingType() {
    return this.attackerShellingStatus.shellingType
  }

  get proficiencyModifier() {
    const { attacker, shellingType, specialAttack } = this
    if (shellingType === 'Shelling') {
      return { power: 1, hitRate: 0, criticalRate: 0 }
    }
    return getProficiencyModifier(attacker.ship, specialAttack)
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
      attackerShellingStatus,
      combinedFleetFactors,
      eventMapModifier,
      specialAttack,
      isArmorPiercing
    } = this
    const { engagement } = battleState
    const { role, formation } = attacker
    const combinedFleetFactor = combinedFleetFactors.power

    const installationType = this.getDefenderInstallationType()

    return attackerShellingStatus.calcPower({
      role,
      formation,
      engagement,
      combinedFleetFactor,
      eventMapModifier,
      specialAttack,
      isArmorPiercing,
      installationType,
      isCritical
    })
  }

  get accuracy() {
    const { attacker, combinedFleetFactors, attackerShellingStatus, isArmorPiercing, specialAttack, fitGunBonus } = this
    const { role, formation } = attacker

    return attackerShellingStatus.calcAccuracy({
      fitGunBonus,
      combinedFleetFactor: combinedFleetFactors.accuracy,
      role,
      formation,
      isArmorPiercing,
      specialAttack
    })
  }

  get defenderEvasionValue() {
    const { ship, formation, role } = this.defender
    const formationModifier = formation.getModifiersWithRole(role).shelling.evasion
    return calcEvasionValue(ship, formationModifier)
  }

  get hitRate() {
    const { accuracy, defender, defenderEvasionValue, proficiencyModifier } = this
    const moraleModifier = defender.ship.morale.evasionModifier

    return calcHitRate(accuracy.value, defenderEvasionValue, moraleModifier, proficiencyModifier.hitRate)
  }

  get criticalRate() {
    const { hitRate, proficiencyModifier } = this
    const hitNumB = Math.floor(Math.sqrt(hitRate * 100 * 1.3))
    return (hitNumB + 1) / 100 + proficiencyModifier.criticalRate
  }

  get defensePower() {
    const { stats, totalEquipmentStats } = this.defender.ship
    return new DefensePower(stats.armor, totalEquipmentStats(equip => equip.improvement.defensePowerModifier))
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = new DefensePower(
      defender.ship.stats.armor,
      defender.ship.totalEquipmentStats(equip => equip.improvement.defensePowerModifier)
    )
    return new Damage(power.value, defensePower, defender.ship.health.nowHp, remainingAmmoModifier)
  }

  get taihaRate() {
    const { damage, defender, hitRate, criticalRate, isCritical } = this
    const { nowHp, maxHp } = defender.ship.health
    const { side } = defender

    const isTaihaDamage = (value: number) => (nowHp - value) / maxHp <= 0.25
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
      if (side === Side.Player && nowHp - value <= 0) {
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
    const { attacker, defender, attackerShellingStatus } = this
    const defenderIsInstallation = defender.ship.isInstallation
    const { shellingType } = attackerShellingStatus

    const { ship } = attacker

    if (ship.health.damage === 'Lost') {
      return false
    }

    if (defender.ship.shipType.isSubmarineClass) {
      return false
    }

    if (shellingType === 'CarrierShelling') {
      if (ship.health.lte('Heavy')) {
        return false
      }

      if (!ship.shipType.is('ArmoredAircraftCarrier') && ship.health.lte('Moderate')) {
        return false
      }

      const planes = ship.planes.filter(plane => plane.slotSize > 0)

      if (
        defenderIsInstallation &&
        planes.some(plane => plane.category.isDiveBomber && !plane.equipment.isAntiInstallationBomber)
      ) {
        return false
      }

      return ship.planes.some(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    }

    if (ship.shipType.isSubmarineClass && defenderIsInstallation) {
      return ship.hasEquipmentCategory('SpecialAmphibiousTank')
    }

    return true
  }
}
