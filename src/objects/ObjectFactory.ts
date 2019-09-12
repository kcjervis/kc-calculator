import { MasterData } from "../data"
import { GearFactory } from "./gear"
import { FleetFactory } from "./fleet"
import { LandBasedAirCorpsFactory } from "./landBasedAirCorps"
import { OperationFactory } from "./operation"
import { ShipFactory } from "./Ship"

export default class ObjectFactory {
  private readonly gearFactory: GearFactory
  private readonly shipFactory: ShipFactory
  private readonly fleetFactory: FleetFactory
  private readonly landBasedAirCorpsFactory: LandBasedAirCorpsFactory
  private readonly operationFactory: OperationFactory
  constructor(private readonly masterData = new MasterData()) {
    this.gearFactory = new GearFactory(masterData.gears)
    this.shipFactory = new ShipFactory(masterData.ships, this.gearFactory)
    this.fleetFactory = new FleetFactory(this.shipFactory)
    this.landBasedAirCorpsFactory = new LandBasedAirCorpsFactory(this.gearFactory)
    this.operationFactory = new OperationFactory(this.fleetFactory, this.landBasedAirCorpsFactory)
  }

  get createOperation() {
    return this.operationFactory.create
  }

  get createFleet() {
    return this.fleetFactory.create
  }

  get createLandBasedAirCorps() {
    return this.landBasedAirCorpsFactory.create
  }

  get createShip() {
    return this.shipFactory.create
  }

  get createGear() {
    return this.gearFactory.create
  }
}
