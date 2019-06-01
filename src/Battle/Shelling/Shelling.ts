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

type AttackModifiers = { power: number; accuracy: number }

export default class Shelling implements ShellingInformation {
  public static getCombinedFleetFactor = getCombinedFleetFactor
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public engagement: Engagement,
    public specialAttack?: DayCombatSpecialAttack,
    public isCritical = false,

    public specialMultiplicative = 1,
    public remainingAmmoModifier = 1,
    public manualInstallationType?: InstallationType
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

  private get specialAttackModifiers(): AttackModifiers {
    const { specialAttack } = this
    if (!specialAttack) {
      return { power: 1, accuracy: 1 }
    }
    return { power: specialAttack.modifier.power, accuracy: 1 }
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
      specialMultiplicative,
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
      specialMultiplicative,
      specialAttack,
      isArmorPiercing,
      installationType,
      isCritical
    })
  }

  get accuracy() {
    const { attacker, combinedFleetFactors, specialAttackModifiers } = this

    const { level, stats, totalEquipmentStats } = attacker.ship

    // 仮置き
    const fitGunBonus = 0
    const apShellModifier = 1
    const formationModifier = 1

    const factors: ShellingAccuracyFactors = {
      combinedFleetFactor: combinedFleetFactors.accuracy,
      level,
      luck: stats.luck,
      equipmentAccuracy: totalEquipmentStats('accuracy'),
      improvementModifier: totalEquipmentStats(equip => equip.improvement.shellingAccuracyModifier),

      moraleModifier: 1,
      formationModifier,
      fitGunBonus,
      specialAttackModifier: specialAttackModifiers.accuracy,
      apShellModifier
    }

    return new ShellingAccuracy(factors)
  }

  get damage() {
    const { power, defender, remainingAmmoModifier } = this
    return new Damage(power.value, defender.ship.stats.armor, remainingAmmoModifier)
  }
}
