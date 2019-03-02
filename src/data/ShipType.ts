import { api_mst_stype } from '@jervis/data'
import ShipTypeId from './ShipTypeId'

/** 艦種 */
export default class ShipType {
  public static readonly all = api_mst_stype.map(raw => {
    const equippableCategoryIds = Object.entries(raw.api_equip_type)
      .filter(([categoryId, equippable]) => equippable === 1)
      .map(([categoryId, equippable]) => Number(categoryId))
    return new ShipType(raw.api_id, raw.api_name, equippableCategoryIds)
  })

  public static fromId(id: number) {
    const found = ShipType.all.find(shipType => shipType.id === id)
    if (found) {
      return found
    }
    const newShipType = new ShipType(id, '', [])
    ShipType.all.push(newShipType)
    return newShipType
  }

  private constructor(
    public readonly id: ShipTypeId,
    public readonly name: string,
    public readonly equippableCategoryIds: number[]
  ) {
    if (id === ShipTypeId.Battlecruiser) {
      this.name = '巡洋戦艦'
    }
  }

  public is(key: keyof typeof ShipTypeId) {
    return this.id === ShipTypeId[key]
  }

  public either = (...keys: Array<keyof typeof ShipTypeId>) => {
    return keys.some(this.is)
  }

  /**
   * 駆逐艦
   */
  get isDestroyer() {
    return this.id === ShipTypeId.Destroyer
  }

  /**
   * 戦艦系
   */
  get isBattleship() {
    return [
      ShipTypeId.Battlecruiser,
      ShipTypeId.Battleship,
      ShipTypeId.AviationBattleship,
      ShipTypeId.SuperDreadnoughts
    ].includes(this.id)
  }

  /**
   * 空母系
   */
  get isAircraftCarrier() {
    return [ShipTypeId.LightAircraftCarrier, ShipTypeId.AircraftCarrier, ShipTypeId.ArmoredAircraftCarrier].includes(
      this.id
    )
  }

  /**
   * 潜水系
   */
  get isSubmarine() {
    return [ShipTypeId.Submarine, ShipTypeId.SubmarineAircraftCarrier].includes(this.id)
  }
}
