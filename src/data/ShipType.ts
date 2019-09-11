import { api_mst_stype } from "@jervis/data"
import ShipTypeId from "./ShipTypeId"

/** 艦種 */
export default class ShipType {
  public static readonly all = api_mst_stype.map(raw => {
    const equippableCategoryIds = Object.entries(raw.api_equip_type)
      .filter(([categoryId, equippable]) => equippable === 1)
      .map(([categoryId, equippable]) => Number(categoryId))
    return new ShipType(raw.api_id, raw.api_name, equippableCategoryIds)
  })

  public static fromId = (id: number) => {
    const found = ShipType.all.find(shipType => shipType.id === id)
    if (found) {
      return found
    }
    const newShipType = new ShipType(id, "", [])
    ShipType.all.push(newShipType)
    return newShipType
  }

  private constructor(
    public readonly id: ShipTypeId,
    public readonly name: string,
    public readonly equippableCategoryIds: number[]
  ) {
    if (id === ShipTypeId.Battlecruiser) {
      this.name = "巡洋戦艦"
    }
  }

  public is = (key: keyof typeof ShipTypeId) => {
    return this.id === ShipTypeId[key]
  }

  public any = (...keys: Array<keyof typeof ShipTypeId>) => {
    return keys.some(this.is)
  }

  /**
   * 駆逐艦
   */
  get isDestroyer() {
    return this.id === ShipTypeId.Destroyer
  }

  /**
   * 軽巡級
   * 軽巡,雷巡,練巡
   */
  get isLightCruiserClass() {
    return this.any("LightCruiser", "TorpedoCruiser", "TrainingCruiser")
  }

  /**
   * 重巡級
   * 重巡,航巡
   */
  get isHeavyCruiserClass() {
    return this.any("HeavyCruiser", "AviationCruiser")
  }

  /**
   * 戦艦級
   * 戦艦,巡洋戦艦,航空戦艦,超弩級戦艦
   */
  get isBattleshipClass() {
    return this.any("Battlecruiser", "Battleship", "AviationBattleship", "SuperDreadnoughts")
  }

  /**
   * 空母級
   * 軽空母,正規空母,装甲空母
   */
  get isAircraftCarrierClass() {
    return this.any("LightAircraftCarrier", "AircraftCarrier", "ArmoredAircraftCarrier")
  }

  /**
   * 潜水級
   */
  get isSubmarineClass() {
    return [ShipTypeId.Submarine, ShipTypeId.SubmarineAircraftCarrier].includes(this.id)
  }
}
