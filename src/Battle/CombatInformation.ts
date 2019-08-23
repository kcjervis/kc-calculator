import { IShip } from "../objects"

import BattleType from "../constants/BattleType"
import { IBattleFleet, IShipBattleInformation } from "./BattleFleet"

export interface ICombatInformation {
  player: IBattleFleet
  enemy: IBattleFleet

  battleType: BattleType

  getShipInformation: (ship: IShip) => IShipBattleInformation
}

export default class CombatInformation implements ICombatInformation {
  constructor(
    public readonly player: IBattleFleet,
    public readonly enemy: IBattleFleet,
    public readonly battleType: BattleType
  ) {}

  public getShipInformation(ship: IShip) {
    const { player, enemy } = this
    const info = player.getShipInformation(ship)
    if (info) {
      return info
    }

    const enemyInfo = enemy.getShipInformation(ship)
    if (enemyInfo) {
      return enemyInfo
    }
    throw console.error("ship info is not found")
  }
}
