import { IShip } from '../../objects'
import { NightAttackType, ShipRole, InstallationType, NightAttackPowerFactors } from '../../types'
import { sumBy } from 'lodash-es'
import { Formation } from '../../constants'
import NightAttackPower from './NightAttackPower'
import ShipAntiInstallationStatus from '../ShipAntiInstallationStatus'
import { calcCruiserFitBonus, getProficiencyModifier } from '../Shelling/ShipShellingStatus'

type ShipNightAttackPowerOptions = Partial<{
  role: ShipRole
  formation: Formation
  nightContactModifier: number
  installationType: InstallationType
  isCritical: boolean
  eventMapModifier: number
}>

const isNightAerialAttackShip = (ship: IShip) => {
  if (!ship.shipType.isAircraftCarrierClass) {
    return false
  }

  // Saratoga Mk.II | 夜間作戦航空要員
  const hasNoap = ship.masterId === 345 || ship.hasEquipment(equip => [258, 259].includes(equip.masterId))
  if (!hasNoap) {
    return false
  }

  return ship.planes.some(plane => plane.slotSize > 0 && plane.isNightPlane)
}

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

  get nightAerialAttackPower() {
    const { ship, nightAttackType } = this
    if (nightAttackType !== 'NightAerialAttack') {
      return 0
    }

    return ship.nakedStats.firepower + sumBy(ship.planes, plane => plane.nightAerialAttackPower)
  }

  public calcPower = (options: ShipNightAttackPowerOptions) => {
    const {
      role = 'Main',
      nightContactModifier = 0,
      isCritical = false,
      formation = Formation.LineAhead,
      eventMapModifier = 1,
      installationType = 'None'
    } = options
    const { ship, nightAttackType, firepower, torpedo, improvementModifier, nightAerialAttackPower } = this

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.power
    const healthModifier = ship.health.nightAttackPowerModifire
    const antiInstallationModifiers = new ShipAntiInstallationStatus(ship).getModifiersFromType(installationType)
    const specialAttackModifier = 1
    const cruiserFitBonus = calcCruiserFitBonus(ship)

    const effectivenessMultiplicative = antiInstallationModifiers.postCapMultiplicative
    const effectivenessAdditive = 0
    const criticalModifier = isCritical ? 1.5 : 1
    const proficiencyModifier = getProficiencyModifier(ship).power

    const factors: NightAttackPowerFactors = {
      nightAttackType,
      firepower,
      torpedo,
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
