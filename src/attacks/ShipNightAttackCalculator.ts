import { IShip, IGear } from "../objects"
import { sumBy } from "lodash-es"
import {
  AttackPowerModifierRecord,
  createCriticalFm,
  createAttackPower,
  composeAttackPowerModifierRecord
} from "../common"
import { ShipId, GearId } from "@jervis/data"
import NightCombatSpecialAttack from "./NightCombatSpecialAttack"

const isNoap = ({ gearId }: IGear) =>
  gearId === GearId["夜間作戦航空要員"] || gearId === GearId["夜間作戦航空要員+熟練甲板員"]

export const isNightAerialAttackShip = (ship: IShip) => {
  if (!ship.shipType.isAircraftCarrierClass) {
    return false
  }

  const hasNoap = [ShipId["Saratoga Mk.II"], ShipId["赤城改二戊"]].includes(ship.shipId) || ship.hasGear(isNoap)
  if (!hasNoap) {
    return false
  }

  return ship.planes.some(plane => plane.slotSize > 0 && plane.isNightPlane)
}

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

    const record: AttackPowerModifierRecord = {}
    if (typeDCount === 0) {
      return
    }
    if (typeDCount === 1) {
      record.a14 = 1.25
    }
    if (typeDCount >= 2) {
      record.a13 = 1.12
    }
    if (typeD3Count >= 1) {
      record.b13 = 10
    }
    return record
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
    const cap = 300

    const healthModifier = this.ship.health.nightAttackPowerModifier

    let specialAttackModifier = 1
    let typeDModifier: AttackPowerModifierRecord | undefined
    if (specialAttack) {
      specialAttackModifier = specialAttack.modifier.power
      if (specialAttack.isDestroyerCutin) {
        typeDModifier = this.typeDModifier
      }
    }

    const a14 = formationModifier * healthModifier * specialAttackModifier
    const b14 = this.ship.getCruiserFitBonus()

    const modifiers = composeAttackPowerModifierRecord({ a14, b14 }, params.modifiers, typeDModifier)

    const fm11next = isCritical ? this.getCriticalFm() : undefined
    return createAttackPower({ basic, cap, modifiers, fm11next })
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
