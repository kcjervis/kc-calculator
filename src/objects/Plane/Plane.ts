import { AirControlState } from "../../common"
import { GearCategory } from "../../data"
import { IGear } from "../gear"
import { GearId } from "@jervis/data"

export interface IPlane {
  gear: IGear
  is: IGear["is"]
  index: number
  category: GearCategory
  slotSize: number
  fighterPower: number
  interceptionPower: number

  canContact: boolean
  contactTriggerFactor: number
  contactSelectionRate: (state: AirControlState) => number

  participatesInAirstrike: boolean
  participatesInCarrierShelling: boolean

  fleetLosModifier: number

  isSwordfish: boolean
  isNightFighter: boolean
  isNightAttacker: boolean
  isNightPlane: boolean
  isNightAircraft: boolean
  calcNightAerialAttackPower: (isAntiInstallation?: boolean) => number

  fighterCombatResistModifier: number
  adjustedAntiAirResistModifier: number
  fleetAntiAirResistModifier: number

  shotdown: (value: number) => void
}

export default class Plane implements IPlane {
  constructor(public readonly gear: IGear, private readonly slots: number[], public readonly index: number) {}

  get is() {
    return this.gear.is
  }

  get category() {
    return this.gear.category
  }

  get slotSize() {
    const { slots, index } = this
    return slots[index]
  }
  set slotSize(value: number) {
    const { slots, index } = this
    slots[index] = value
  }

  get fighterPower() {
    const { gear, slotSize } = this
    return gear.calcFighterPower(slotSize)
  }

  get interceptionPower() {
    const { gear, slotSize } = this
    return gear.calcFighterPower(slotSize, true)
  }

  get canContact() {
    return this.is("CarrierBasedTorpedoBomber") || this.is("ReconnaissanceAircraft")
  }

  get contactTriggerFactor() {
    const { gear, slotSize } = this
    return Math.floor(gear.los * Math.sqrt(slotSize))
  }

  public contactSelectionRate = (state: AirControlState) => {
    const { los, improvement } = this.gear
    return Math.ceil(los + improvement.contactSelectionModifier) / (20 - 2 * state.contactMultiplier)
  }

  get participatesInAirstrike() {
    const { slotSize } = this
    if (slotSize === 0) {
      return false
    }
    return this.is("DiveBomber") || this.is("TorpedoBomber")
  }

  get participatesInCarrierShelling() {
    const { category, slotSize } = this
    if (slotSize === 0) {
      return false
    }
    return category.any(
      "CarrierBasedDiveBomber",
      "CarrierBasedTorpedoBomber",
      "JetPoweredFighterBomber",
      "JetPoweredTorpedoBomber"
    )
  }

  get fleetLosModifier() {
    const { gear, slotSize } = this
    if (this.is("ReconnaissanceSeaplane") || this.is("SeaplaneBomber")) {
      return gear.los * Math.floor(Math.sqrt(slotSize))
    }
    return 0
  }

  get isSwordfish() {
    return this.gear.name.includes("Swordfish")
  }

  get isNightFighter() {
    return this.gear.iconId === 45
  }

  get isNightAttacker() {
    return this.gear.iconId === 46
  }

  /**
   * 夜戦夜攻
   */
  get isNightPlane() {
    return this.isNightFighter || this.isNightAttacker
  }

  /**
   * 夜戦夜攻
   * Swordfish系
   * 零戦62型(爆戦/岩井隊)
   * 彗星一二型(三一号光電管爆弾搭載機)
   */
  get isNightAircraft() {
    const { isNightPlane, isSwordfish, gear } = this
    return (
      isNightPlane ||
      isSwordfish ||
      [GearId["零戦62型(爆戦/岩井隊)"], GearId["彗星一二型(三一号光電管爆弾搭載機)"]].includes(gear.gearId)
    )
  }

  public calcNightAerialAttackPower = (isAntiInstallation = false) => {
    const { isNightPlane, isNightAircraft, gear, slotSize } = this
    if (!isNightAircraft) {
      return 0
    }

    const { firepower, torpedo, asw, bombing } = gear
    let nightAircraftModifierA = 0
    let nightAircraftModifierB = 0.3
    if (isNightPlane) {
      nightAircraftModifierA = 3
      nightAircraftModifierB = 0.45
    }

    const improvementModifier = Math.sqrt(gear.improvement.value)
    return (
      firepower +
      (isAntiInstallation ? 0 : torpedo) +
      bombing +
      nightAircraftModifierA * slotSize +
      nightAircraftModifierB * (firepower + torpedo + asw + bombing) * Math.sqrt(slotSize) +
      improvementModifier
    )
  }

  get fighterCombatResistModifier() {
    return this.is("JetPoweredAircraft") ? 0.6 : 1
  }

  get adjustedAntiAirResistModifier() {
    const { gearId } = this.gear
    if (
      [
        GearId["九七式艦攻(友永隊)"],
        GearId["天山一二型(友永隊)"],
        GearId["九七式艦攻(村田隊)"],
        GearId["天山一二型(村田隊)"],
        GearId["流星改(一航戦/熟練)"],

        GearId["九九式艦爆(江草隊)"],
        GearId["彗星(江草隊)"],
        GearId["零戦62型(爆戦/岩井隊)"],
        GearId["彗星一二型(六三四空/三号爆弾搭載機)"],
        GearId["彗星一二型(三一号光電管爆弾搭載機)"],

        GearId["瑞雲(六三四空)"],
        GearId["瑞雲12型"],
        GearId["瑞雲12型(六三四空)"],
        GearId["瑞雲(六三四空/熟練)"],

        GearId["一式陸攻(野中隊)"]
      ].includes(gearId)
    ) {
      return 0.6
    }

    if (
      [
        GearId["瑞雲改二(六三四空)"],
        GearId["瑞雲改二(六三四空/熟練)"],

        GearId["噴式景雲改"],
        GearId["橘花改"]
      ].includes(gearId)
    ) {
      return 0.5
    }

    return 1
  }

  get fleetAntiAirResistModifier() {
    const { gearId } = this.gear
    if (
      [
        GearId["彗星(江草隊)"],
        GearId["零戦62型(爆戦/岩井隊)"],

        GearId["瑞雲12型(六三四空)"],
        GearId["瑞雲(六三四空/熟練)"],
        GearId["瑞雲改二(六三四空)"],

        GearId["噴式景雲改"]
      ].includes(gearId)
    ) {
      return 0.7
    }

    if ([GearId["瑞雲改二(六三四空/熟練)"], GearId["橘花改"]].includes(gearId)) {
      return 0.5
    }

    return 1
  }

  public shotdown = (value: number) => {
    this.slotSize -= value
    if (this.slotSize < 0) {
      this.slotSize = 0
    }
  }
}
