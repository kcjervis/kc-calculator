import { api_mst_stype } from '@kancolle/data'
import ShipTypeId from './ShipTypeId'

/** 艦種 */
export default class ShipType {
  public static readonly all = api_mst_stype.map(
    ({ api_id, api_name, api_scnt }) => new ShipType(api_id, api_name, api_scnt)
  )

  public static fromId(id: number) {
    const found = ShipType.all.find(shipType => shipType.id === id)
    if (found) {
      return found
    }
    const newShipType = new ShipType(id, '', 0)
    ShipType.all.push(newShipType)
    return newShipType
  }

  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly repairTimeMultiplier: number
  ) {
    if (id === 8) {
      this.name = '巡洋戦艦'
    }
  }

  public equal(key: keyof typeof ShipTypeId) {
    return this.id === ShipTypeId[key]
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
