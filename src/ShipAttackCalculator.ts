import {
  Formation,
  Engagement,
  AirControlState,
  FleetType,
  AttackPowerModifierRecord,
  composeAttackPowerModifierRecord
} from "./common"
import { ShipRole } from "./types"
import { IShip } from "./objects"
import {
  ShipShellingCalculator,
  DayCombatSpecialAttack,
  getFleetFactors,
  ShipShellingSupportCalculator,
  ShipTorpedoAttackCalculator,
  ShipAswCalculator,
  ShipNightAttackCalculator,
  NightCombatSpecialAttack
} from "./attacks"

type Params = {
  ship: IShip
  target: IShip

  fleetFactors: ReturnType<typeof getFleetFactors>

  fleetType: FleetType
  formation: Formation
  role: ShipRole

  engagement: Engagement
  isArmorPiercing: boolean

  nightContactModifier: number

  optionalPowerModifiers?: AttackPowerModifierRecord
}

export const createShipAttackCalculator = ({
  ship,
  target,
  fleetFactors,
  formation,
  role,

  engagement,
  isArmorPiercing,

  nightContactModifier,

  optionalPowerModifiers
}: Params) => {
  const formationModifiers = formation.getModifiers(role)
  const engagementModifier = engagement.modifier

  const isAntiInstallation = target.isInstallation
  const specialEnemyModifiers = ship.getSpecialEnemyModifiers(target)

  const shellingCalculator = new ShipShellingCalculator(ship)
  const shellingSupportCalculator = new ShipShellingSupportCalculator(ship)
  const torpedoAttackCalculator = ShipTorpedoAttackCalculator.fromShip(ship)
  const aswCalculator = ShipAswCalculator.fromShip(ship, "Day")
  const nightCalculator = new ShipNightAttackCalculator(ship)

  const canDoTorpedoAttack = ship.nakedStats.torpedo > 0
  const canDoAsw = aswCalculator.type !== "None"

  const calcShellingPower = (isCritical: boolean, specialAttack?: DayCombatSpecialAttack) => {
    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalPowerModifiers)

    return shellingCalculator.calcPower({
      fleetFactor: fleetFactors.shelling,
      formationModifier: formationModifiers.shelling.power,
      engagementModifier,
      modifiers,

      isCritical,
      isAntiInstallation,
      isArmorPiercing,

      specialAttack
    })
  }

  const calcShellingSupportPower = (isCritical: boolean) => {
    const formationModifier = formation.shellingSupportModifiers.power

    return shellingSupportCalculator.calcPower({
      formationModifier,
      engagementModifier,
      isCritical,
      isAntiInstallation
    })
  }

  const calcTorpedoPower = (isCritical: boolean) => {
    return torpedoAttackCalculator.calcPower({
      fleetFactor: fleetFactors.torpedo,
      formationModifier: formationModifiers.torpedo.power,
      engagementModifier,
      isCritical,
      optionalModifiers: optionalPowerModifiers
    })
  }

  const calcAswPower = (isCritical: boolean) => {
    return aswCalculator.calcPower({
      formationModifier: formationModifiers.asw.power,
      engagementModifier,
      isCritical,
      optionalModifiers: optionalPowerModifiers
    })
  }

  const calcNightPower = (isCritical: boolean, specialAttack?: NightCombatSpecialAttack) => {
    const modifiers = composeAttackPowerModifierRecord(specialEnemyModifiers, optionalPowerModifiers)
    return nightCalculator.calcPower({
      formationModifier: formationModifiers.night.power,
      nightContactModifier,
      specialAttack,
      modifiers,
      isCritical,
      isAntiInstallation
    })
  }

  return {
    calcShellingPower,
    calcShellingSupportPower,
    calcTorpedoPower,
    calcAswPower,
    calcNightPower,

    canDoTorpedoAttack,
    canDoAsw
  }
}
