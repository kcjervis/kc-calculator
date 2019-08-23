import { MasterData } from "../data"
import { GearFactory, IGearDataObject } from "./Gear"
import { FleetFactory, IFleetDataObject } from "./Fleet"
import { ILandBasedAirCorpsDataObject, LandBasedAirCorpsFactory } from "./LandBasedAirCorps"
import { IOperationDataObject, OperationFactory } from "./Operation"
import { IShipDataObject, ShipFactory } from "./Ship"

export default class ObjectFactory {
  private readonly gearFactory: GearFactory
  private readonly shipFactory: ShipFactory
  private readonly fleetFactory: FleetFactory
  private readonly landBasedAirCorpsFactory: LandBasedAirCorpsFactory
  private readonly operationFactory: OperationFactory
  constructor(private readonly masterData: MasterData) {
    this.gearFactory = new GearFactory(masterData.gears)
    this.shipFactory = new ShipFactory(masterData.ships, this.gearFactory)
    this.fleetFactory = new FleetFactory(this.shipFactory)
    this.landBasedAirCorpsFactory = new LandBasedAirCorpsFactory(this.gearFactory)
    this.operationFactory = new OperationFactory(this.fleetFactory, this.landBasedAirCorpsFactory)
  }

  public createOperation(dataObject: IOperationDataObject) {
    return this.operationFactory.create(dataObject)
  }

  public createFleet(dataObject: IFleetDataObject) {
    return this.fleetFactory.create(dataObject)
  }

  public createLandBasedAirCorps(dataObject: ILandBasedAirCorpsDataObject) {
    return this.landBasedAirCorpsFactory.create(dataObject)
  }

  public createShip(dataObject: IShipDataObject) {
    return this.shipFactory.create(dataObject)
  }

  public createGear(dataObject: IGearDataObject) {
    return this.gearFactory.create(dataObject)
  }
}
