import { StatsBonusRecord } from "./EquipmentBonus"
import { IShip } from "../objects"
export declare const createEquipmentBonus: (
  ship: Pick<IShip, "shipId" | "ruby" | "shipTypeId" | "shipClassId" | "gears">
) => StatsBonusRecord
