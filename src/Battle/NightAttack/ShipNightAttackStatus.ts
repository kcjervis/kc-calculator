import { IShip } from '../../objects'
import { NightAttackType, ShipRole, InstallationType, NightAttackPowerFactors } from '../../types'
import { sumBy } from 'lodash-es'
import { Formation } from '../../constants'
import NightAttackPower from './NightAttackPower'
import ShipAntiInstallationStatus from '../ShipAntiInstallationStatus'
import { calcCruiserFitBonus, getProficiencyModifier } from '../Shelling/ShipShellingStatus'
import NightBattleSpecialAttack, { isNightAerialAttackShip } from './NightBattleSpecialAttack'

type ShipNightAttackPowerOptions = Partial<{
  role: ShipRole
  formation: Formation
  nightContactModifier: number
  installationType: InstallationType
  specialAttack: NightBattleSpecialAttack
  isCritical: boolean
  eventMapModifier: number
}>

export default class ShipNightAttackStatus {
  constructor(private ship: IShip) {}

  get nightAttackType(): NightAttackType {
    const { ship } = this
    if (isNightAerialAttackShip(ship)) {
      return 'NightAerialAttack'
    }
    return 'NightAttack'
  }

  private get firepower() {
    return this.ship.stats.firepower
  }

  private get torpedo() {
    return this.ship.stats.torpedo
  }

  private get improvementModifier() {
    return this.ship.totalEquipmentStats(equip => {
      const { masterId, improvement, category } = equip

      // 12.7cm 連装高角砲、8cm 高角砲、8cm 高角砲改＋増設機銃、10cm 連装高角砲改＋増設機銃
      if ([10, 66, 220, 275].includes(masterId)) {
        return 0.2 * improvement.value
      }
      // 15.5cm 三連装副砲、15.5cm 三連装副砲改、15.2cm 三連装砲
      if ([12, 234, 247].includes(masterId)) {
        return 0.3 * improvement.value
      }

      if (
        category.isMainGun ||
        category.either(
          'SecondaryGun',
          'ArmorPiercingShell',
          'AntiAircraftShell',
          'AntiAircraftFireDirector',
          'Searchlight',
          'Torpedo',
          'LandingCraft',
          'SpecialAmphibiousTank',
          'MidgetSubmarine'
        )
      ) {
        return Math.sqrt(improvement.value)
      }

      return 0
    })
  }

  public calcNightAerialAttackPower(isAntiInstallationWarfare?: boolean) {
    const { ship, nightAttackType } = this
    if (nightAttackType !== 'NightAerialAttack') {
      return 0
    }

    return (
      ship.nakedStats.firepower +
      sumBy(ship.planes, plane => plane.calcNightAerialAttackPower(isAntiInstallationWarfare))
    )
  }

  public calcPower = (options: ShipNightAttackPowerOptions) => {
    const {
      role = 'Main',
      nightContactModifier = 0,
      formation = Formation.LineAhead,
      eventMapModifier = 1,
      installationType = 'None',
      specialAttack,
      isCritical = false
    } = options
    const { ship, nightAttackType, firepower, torpedo, improvementModifier } = this

    const isAntiInstallationWarfare = installationType !== 'None'
    const nightAerialAttackPower = this.calcNightAerialAttackPower(isAntiInstallationWarfare)

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.power
    const healthModifier = ship.health.nightAttackPowerModifire
    const antiInstallationModifiers = new ShipAntiInstallationStatus(ship).getModifiersFromType(installationType)

    let specialAttackModifier = 1
    if (specialAttack) {
      specialAttackModifier = specialAttack.powerModifier
      if (specialAttack.isDestroyerCutin && ship.hasEquipment(267)) {
        specialAttackModifier *= 1.25
      }
    }

    const cruiserFitBonus = calcCruiserFitBonus(ship)

    const effectivenessMultiplicative = antiInstallationModifiers.postCapMultiplicative
    const effectivenessAdditive = 0
    const criticalModifier = isCritical ? 1.5 : 1
    const proficiencyModifier = getProficiencyModifier(ship).power

    const factors: NightAttackPowerFactors = {
      nightAttackType,
      firepower,
      torpedo: isAntiInstallationWarfare ? 0 : torpedo,
      improvementModifier,
      nightAerialAttackPower,
      nightContactModifier,

      formationModifier,
      healthModifier,
      specialAttackModifier,
      cruiserFitBonus,
      antiInstallationModifiers,

      effectivenessMultiplicative,
      effectivenessAdditive,
      criticalModifier,
      proficiencyModifier,
      eventMapModifier
    }
    return new NightAttackPower(factors)
  }
}
