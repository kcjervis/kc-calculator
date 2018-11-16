import BattleType from '../../combats/BattleType'
import { FleetRole, Side } from '../../constants'
import AntiAirCutIn from '../../data/AntiAirCutIn'
import { IBaseShip } from './BaseShip'

export interface IShipAerialCombat {
  /** 加重対空 */
  adjustedAntiAir: number

  /** 艦娘艦隊防空ボーナス */
  fleetAntiAir: number

  /** 撃墜割合を計算 */
  calculateProportionalShotdownRate: (battleType: BattleType) => number

  /** 固定撃墜を計算 */
  calculateFixedShotdownNumber: (battleType: BattleType, fleetAntiAir: number, antiAirCutIn?: AntiAirCutIn) => number

  /** 発動可能な対空CI */
  possibleAntiAirCutIns: AntiAirCutIn[]
}

export default class ShipAerialCombat implements IShipAerialCombat {
  constructor(private readonly ship: IBaseShip) {}

  get adjustedAntiAir() {
    const { fleetInformation, stats, nakedStats, equipmentCollection } = this.ship

    const totalEquipAdjustedAA = equipmentCollection.sumBy(equip => equip.aerialCombat.adjustedAntiAir)
    if (fleetInformation.side === Side.Enemy) {
      return Math.floor(2 * Math.sqrt(stats.antiAir) + totalEquipAdjustedAA)
    }

    const preFloor = nakedStats.antiAir + totalEquipAdjustedAA
    if (this.ship.countEquipment() === 0) {
      return preFloor
    }
    return 2 * Math.floor(preFloor / 2)
  }

  get fleetAntiAir() {
    return Math.floor(this.ship.equipmentCollection.sumBy(equip => equip.aerialCombat.fleetAntiAir))
  }

  get possibleAntiAirCutIns() {
    return AntiAirCutIn.getPossibleAntiAirCutIns(this.ship)
  }

  public calculateProportionalShotdownRate(battleType: BattleType) {
    const combinedFleetModifier = this.getCombinedFleetModifier(battleType)
    return this.adjustedAntiAir * combinedFleetModifier * 0.5 * 0.25 * 0.02
  }

  public calculateFixedShotdownNumber(battleType: BattleType, fleetAntiAir: number, antiAirCutIn?: AntiAirCutIn) {
    const adjustedAntiAir = this.adjustedAntiAir
    const combinedFleetModifier = this.getCombinedFleetModifier(battleType)
    const { side } = this.ship.fleetInformation

    // 敵味方補正
    const campMod = side === Side.Player ? 0.8 : 0.75
    let preFloor = (adjustedAntiAir + fleetAntiAir) * 0.5 * 0.25 * campMod * combinedFleetModifier
    if (antiAirCutIn) {
      preFloor *= antiAirCutIn.fixedAirDefenseModifier
    }
    return Math.floor(preFloor)
  }

  private getCombinedFleetModifier(battleType: BattleType) {
    const { fleetRole, isCombinedFleet } = this.ship.fleetInformation
    if (!isCombinedFleet) {
      return 1
    }
    if (fleetRole === FleetRole.EscortFleet) {
      return 0.48
    }
    if (battleType === BattleType.AirDefenseBattle) {
      return 0.72
    }

    return 0.8
  }
}
