import { MasterData } from '../data'
import { EquipmentFactory } from './Equipment'
import { FleetFactory } from './Fleet'
import { LandBasedAirCorpsFactory } from './LandBasedAirCorps'
import { OperationFactory } from './Operation'
import { ShipFactory } from './Ship'

export default class ObjectFactory {
  public readonly equipmentFactory: EquipmentFactory
  public readonly shipFactory: ShipFactory
  public readonly fleetFactory: FleetFactory
  public readonly landBasedAirCorpsFactory: LandBasedAirCorpsFactory
  public readonly operationFactory: OperationFactory
  constructor(private readonly masterData: MasterData) {
    this.equipmentFactory = new EquipmentFactory(masterData.equipments)
    this.shipFactory = new ShipFactory(masterData.ships, this.equipmentFactory)
    this.fleetFactory = new FleetFactory(this.shipFactory)
    this.landBasedAirCorpsFactory = new LandBasedAirCorpsFactory(this.equipmentFactory)
    this.operationFactory = new OperationFactory(this.fleetFactory, this.landBasedAirCorpsFactory)
  }
}
