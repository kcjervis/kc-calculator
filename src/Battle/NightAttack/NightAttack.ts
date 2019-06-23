import { Formation, Engagement, FleetType, Side } from '../../constants'
import { IShip } from '../../objects'
import { sumBy } from 'lodash-es'
import NightBattleSpecialAttack from './NightBattleSpecialAttack'
import { ShipInformation, InstallationType } from '../../types'

import ShipNightAttackStatus from './ShipNightAttackStatus'
import Damage from '../Damage'
import DefensePower from '../DefensePower'

type AttackModifiers = { power: number; accuracy: number }

export default class NightAttack {
  constructor(
    public attacker: ShipInformation,
    public defender: ShipInformation,
    public specialAttack?: NightBattleSpecialAttack,
    public isCritical = false,

    public nightContactModifier = 0,
    public eventMapModifier = 1,
    public remainingAmmoModifier = 1,
    public manualInstallationType?: InstallationType
  ) {}

  get attackerNightAttackStatus() {
    return new ShipNightAttackStatus(this.attacker.ship)
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
      attackerNightAttackStatus,
      specialAttack,
      nightContactModifier,
      isCritical,
      eventMapModifier
    } = this
    const { role, formation } = this.attacker

    const installationType = manualInstallationType || defenderInstallationType

    return attackerNightAttackStatus.calcPower({
      role,
      nightContactModifier,
      formation,
      installationType,
      specialAttack,
      isCritical,
      eventMapModifier
    })
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
