import { Formation, Engagement, FleetType, Side } from '../../constants'
import { IShip } from '../../objects'
import { sumBy } from 'lodash-es'
import DayCombatSpecialAttack from './DayCombatSpecialAttack'
import {
  ShipInformation,
  ShellingType,
  ShellingInformation,
  ShellingAccuracyFactors,
  InstallationType
} from '../../types'

import ShellingPower from './ShellingPower'
import ShellingAccuracy from './ShellingAccuracy'
import ShipShellingStatus from './ShipShellingStatus'
import getCombinedFleetFactor from './getCombinedFleetFactor'
import Damage from '../Damage'
import DefensePower from '../DefensePower'
import { calcEvasionValue } from '../Evasion'

type AttackModifiers = { power: number; accuracy: number }

export default class Shelling implements ShellingInformation {
  public static getCombinedFleetFactor = getCombinedFleetFactor
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public engagement: Engagement,
    public specialAttack?: DayCombatSpecialAttack,
    public isCritical = false,

    public eventMapModifier = 1,
    public remainingAmmoModifier = 1,
    public manualInstallationType?: InstallationType,
    public fitGunBonus = 0
  ) {}

  get shellingType(): ShellingType {
    const { shipType, shipClass, isInstallation, hasEquipment } = this.attacker.ship
    if (shipType.isAircraftCarrierClass) {
      return 'CarrierShelling'
    }

    if (!shipClass.is('RevisedKazahayaClass') && !isInstallation) {
      return 'Shelling'
    }

    if (hasEquipment(equip => equip.category.isAerialCombatAircraft)) {
      return 'CarrierShelling'
    }

    return 'Shelling'
  }

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
    return { power, accuracy: 1 }
  }

  get canParticipate() {
    const { shellingType, attacker } = this
    if (shellingType == 'CarrierShelling') {
      return attacker.ship.planes.some(plane => plane.slotSize > 0 && plane.category.isCarrierShellingAircraft)
    }
    return true
  }

  get criticalModifier() {
    return this.isCritical ? 1.5 : 1
  }

  get attackerShellingStatus() {
    return new ShipShellingStatus(this.attacker.ship)
  }

  get defenderInstallationType(): InstallationType {
    const { ship } = this.defender
    if (!ship.isInstallation) {
      return 'None'
    }
    if (ship.name.includes('砲台子鬼')) {
      return 'Pillbox'
    }
    if (ship.name.includes('離島') || ship.name.includes('離島')) {
      return 'IsolatedIsland'
    }
    if (ship.name.includes('集積')) {
      return 'SupplyDepot'
    }
    return 'SoftSkinned'
  }

  get power() {
    const {
      manualInstallationType,
      defenderInstallationType,
      attackerShellingStatus,
      engagement,
      combinedFleetFactors,
      eventMapModifier,
      specialAttack,
      isArmorPiercing,
      isCritical
    } = this
    const { role, formation } = this.attacker
    const combinedFleetFactor = combinedFleetFactors.power

    const installationType = manualInstallationType || defenderInstallationType

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
    const { accuracy, defender, defenderEvasionValue, attackerShellingStatus } = this
    const proficiencyModifier = attackerShellingStatus.proficiencyModifier.hitRate
    const moraleModifier = defender.ship.morale.evasionModifier
    let basicRate = (accuracy.value - defenderEvasionValue) * moraleModifier
    if (basicRate < 10) {
      basicRate = 10
    }
    if (basicRate > 96) {
      basicRate = 96
    }
    return (basicRate + proficiencyModifier + 1) / 100
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    const defensePower = new DefensePower(
      defender.ship.stats.armor,
      defender.ship.totalEquipmentStats(equip => equip.improvement.defensePowerModifier)
    )
    return new Damage(power.value, defensePower, remainingAmmoModifier)
  }
}
