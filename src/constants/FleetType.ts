import { FleetTypeKey } from "../types"

export default class FleetType {
  public static readonly values: FleetType[] = []

  public static readonly Single = new FleetType(0, "Single", "通常艦隊")
  public static readonly CarrierTaskForce = new FleetType(1, "CarrierTaskForce", "空母機動部隊")
  public static readonly SurfaceTaskForce = new FleetType(2, "SurfaceTaskForce", "水上打撃部隊")
  public static readonly TransportEscort = new FleetType(3, "TransportEscort", "輸送護衛部隊")
  public static readonly Combined = new FleetType(5, "Combined", "敵連合")

  public static fromId = (id: number) => {
    return FleetType.values.find(fleetType => fleetType.id === id)
  }

  public static fromString = (str: string) => {
    return FleetType.values.find(fleetType => fleetType.key === str || fleetType.name === str)
  }

  private constructor(public readonly id: number, public readonly key: FleetTypeKey, public readonly name: string) {
    FleetType.values.push(this)
  }

  public get isCombined() {
    return this !== FleetType.Single
  }
}
