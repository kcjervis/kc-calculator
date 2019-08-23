import { ShipInformation, ShellingType, InstallationType, BattleState } from "../types"

export default class Attackable {
  constructor(public attacker: ShipInformation, public defender: ShipInformation) {}
}
