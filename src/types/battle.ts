import { IShip } from "../objects"
import { Side, FleetType, Formation, Engagement, AirControlState } from "../common"

export type FleetTypeKey = "Single" | "CarrierTaskForce" | "SurfaceTaskForce" | "TransportEscort" | "Combined"

export type ShipRole = "Main" | "Escort"

type ContactLevel = 0 | 1 | 2 | 3

export type BattleState = {
  engagement: Engagement
  airControlState: AirControlState
}

export type ShipInformation = {
  ship: IShip
  side: Side
  isFlagship: boolean
  fleetType: FleetType
  role: ShipRole
  formation: Formation
}

export type ShipNightAttackDef = ShipInformation & {
  nightContact: ContactLevel
  starshell: boolean
  searchlight: boolean
}
