import { IShip } from '../objects'
import { Side, FleetType, Formation, Engagement } from '../constants'

export type FleetTypeKey = 'Single' | 'CarrierTaskForce' | 'SurfaceTaskForce' | 'TransportEscort' | 'Combined'

export type ShipRole = 'Main' | 'Escort'

export type ShipInformation = {
  ship: IShip
  side: Side
  isFlagship: boolean
  fleetType: FleetType
  role: ShipRole
  formation: Formation
}
