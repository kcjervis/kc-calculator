import { IShip } from "../../objects"
import {
  NightAttackType,
  ShipRole,
  InstallationType,
  NightAttackPowerFactors,
  AntiInstallationModifiers
} from "../../types"
import { sumBy } from "lodash-es"
import { Formation } from "../../constants"
import NightAttackPower from "./NightAttackPower"
import { calcCruiserFitBonus, getProficiencyModifier } from "../Shelling/ShipShellingStatus"
import NightCombatSpecialAttack, { isNightAerialAttackShip } from "./NightCombatSpecialAttack"
import { GearId } from "@jervis/data"

type ShipNightAttackPowerOptions = Partial<{
  role: ShipRole
  formation: Formation
  nightContactModifier: number
  specialAttack: NightCombatSpecialAttack
  isCritical: boolean
  eventMapModifier: number
}> & {
  target: IShip
}

export default class ShipNightAttackStatus {
  constructor(private ship: IShip) {}

  get nightAttackType(): NightAttackType {
    const { ship } = this
    if (isNightAerialAttackShip(ship)) {
      return "NightAerialAttack"
    }
    return "NightAttack"
  }

  get proficiencyModifier() {
    const { ship, nightAttackType } = this
    if (nightAttackType === "NightAttack") {
      return { power: 1, hitRate: 0, criticalRate: 0 }
    }
    return getProficiencyModifier(ship)
  }

  public calcNightAerialAttackPower(isAntiInstallationWarfare?: boolean) {
    const { ship, nightAttackType } = this
    if (nightAttackType !== "NightAerialAttack") {
      return 0
    }

    return (
      ship.nakedStats.firepower +
      sumBy(ship.planes, plane => plane.calcNightAerialAttackPower(isAntiInstallationWarfare))
    )
  }

  public calcPower = (options: ShipNightAttackPowerOptions) => {
    const {
      role = "Main",
      nightContactModifier = 0,
      formation = Formation.LineAhead,
      eventMapModifier = 1,
      specialAttack,
      isCritical = false,
      target
    } = options
    const { ship, nightAttackType, proficiencyModifier } = this
    const { firepower, torpedo } = ship.stats

    const isAntiInstallationWarfare = target.isInstallation

    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.nightAttackPowerModifier)

    const nightAerialAttackPower = this.calcNightAerialAttackPower(isAntiInstallationWarfare)

    const formationModifier = formation.getModifiersWithRole(role).nightBattle.power
    const healthModifier = ship.health.nightAttackPowerModifire

    let antiInstallationModifiers = ship.getAntiInstallationModifier(target)
    if (isAntiInstallationWarfare && specialAttack && specialAttack.isAerialAttack) {
      antiInstallationModifiers = { a13: 1, a13next: 1, a5: 1, b12: 0, b13: 0, b13next: 0 }
    }

    let specialAttackModifier = 1
    if (specialAttack) {
      specialAttackModifier = specialAttack.modifier.power
      if (specialAttack.isDestroyerCutin && ship.hasGear(GearId["12.7cm連装砲D型改二"])) {
        specialAttackModifier *= 1.25
      }
    }

    const cruiserFitBonus = calcCruiserFitBonus(ship)

    const effectivenessMultiplicative = antiInstallationModifiers.a5
    const effectivenessAdditive = 0
    const criticalModifier = isCritical ? 1.5 : 1

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
      proficiencyModifier: proficiencyModifier.power,
      eventMapModifier
    }
    return new NightAttackPower(factors)
  }
}
