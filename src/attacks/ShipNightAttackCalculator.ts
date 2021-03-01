import { IShip } from "../objects"
import { sumBy } from "lodash-es"
import {
  AttackPowerModifierRecord,
  createCriticalFm,
  createAttackPower,
  composeAttackPowerModifierRecord
} from "../common"
import { GearId } from "@jervis/data"
import NightCombatSpecialAttack, { isNightAerialAttackShip } from "./NightCombatSpecialAttack"

const NIGHT_POWER_CAP = 360

export default class ShipNightAttackCalculator {
  constructor(private ship: IShip) {}

  private get type() {
    const { ship } = this
    if (isNightAerialAttackShip(ship)) {
      return "NightAerialAttack"
    }
    return "NightAttack"
  }

  private calcNightAerialAttackPower = (isAntiInstallation?: boolean) => {
    const { ship, type } = this
    if (type !== "NightAerialAttack") {
      return 0
    }

    return ship.nakedStats.firepower + sumBy(ship.planes, plane => plane.calcNightAerialAttackPower(isAntiInstallation))
  }

  private calcBasicPower = (nightContactModifier: number, isAntiInstallation?: boolean) => {
    const { ship, type } = this
    const { firepower } = ship.stats
    const torpedo = isAntiInstallation ? 0 : ship.stats.torpedo
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.nightAttackPowerModifier)
    if (type === "NightAerialAttack") {
      return this.calcNightAerialAttackPower(isAntiInstallation) + nightContactModifier
    }
    return firepower + torpedo + improvementModifier + nightContactModifier
  }

  private getCriticalFm = () => {
    if (this.type === "NightAerialAttack") {
      const proficiencyModifiers = this.ship.getNormalProficiencyModifiers()
      return createCriticalFm(proficiencyModifiers.power)
    }

    return createCriticalFm()
  }

  private get typeDModifier() {
    const { ship } = this
    const typeD2Count = ship.countGear(GearId["12.7cm連装砲D型改二"])
    const typeD3Count = ship.countGear(GearId["12.7cm連装砲D型改三"])
    const typeDCount = typeD2Count + typeD3Count

    let value = 1

    if (typeDCount === 0) {
      return value
    }

    if (typeDCount === 1) {
      value = 1.25
    }
    if (typeDCount >= 2) {
      value = 1.4
    }
    if (typeD3Count) {
      value *= 1.05
    }
    return value
  }

  public calcPower = (params: {
    nightContactModifier: number
    formationModifier: number
    specialAttack?: NightCombatSpecialAttack
    modifiers: AttackPowerModifierRecord

    isCritical?: boolean
    isAntiInstallation?: boolean
  }) => {
    const { nightContactModifier, formationModifier, specialAttack, isCritical, isAntiInstallation } = params
    const basic = this.calcBasicPower(nightContactModifier, isAntiInstallation)

    const healthModifier = this.ship.health.nightAttackPowerModifier

    let specialAttackModifier = 1
    let typeDModifier = 1
    if (specialAttack) {
      specialAttackModifier = specialAttack.modifier.power
      if (specialAttack.isDestroyerCutin) {
        typeDModifier = this.typeDModifier
      }
    }

    const a14 = formationModifier * healthModifier * specialAttackModifier * typeDModifier
    const b14 = this.ship.getCruiserFitBonus()

    const modifiers = composeAttackPowerModifierRecord({ a14, b14 }, params.modifiers)

    const fm11next = isCritical ? this.getCriticalFm() : undefined
    return createAttackPower({ basic, cap: NIGHT_POWER_CAP, modifiers, fm11next })
  }

  public calcAccuracy = (params: {
    starshellModifier: number
    contactModifier: number
    searchlightModifier: number
    formationModifier: number
    specialAttackModifier?: number
    fitGunBonus?: number
  }) => {
    const {
      starshellModifier,
      contactModifier,
      searchlightModifier,
      formationModifier,
      specialAttackModifier = 1,
      fitGunBonus = 0
    } = params
    const { ship } = this
    const { shipAccuracy, shipType, hasGear } = ship
    const equipmentAccuracy = ship.totalEquipmentStats("accuracy")
    const improvementModifier = ship.totalEquipmentStats(gear => gear.improvement.nightAttackAccuracyModifier)
    const moraleModifier = ship.morale.getAccuracyModifier("night")

    let heavyCruiserBonus = 0
    if (shipType.isHeavyCruiserClass) {
      if (hasGear(GearId["20.3cm連装砲"])) {
        heavyCruiserBonus = 10
      }
      if (hasGear(GearId["20.3cm(2号)連装砲"]) || hasGear(GearId["20.3cm(3号)連装砲"])) {
        heavyCruiserBonus = 15
      }
    }

    const base = Math.floor(
      (69 + starshellModifier) * contactModifier + shipAccuracy + equipmentAccuracy + improvementModifier
    )
    return Math.floor(
      base * formationModifier * moraleModifier * specialAttackModifier +
        searchlightModifier +
        heavyCruiserBonus +
        fitGunBonus
    )
  }
}
