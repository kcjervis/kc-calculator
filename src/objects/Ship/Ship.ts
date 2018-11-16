import { IPlane } from '../Plane'
import { IBaseShip } from './BaseShip'
import ShipAerialCombat from './ShipAerialCombat'

export interface IShip extends IBaseShip {
  planes: IPlane[]
  aerialCombat: ShipAerialCombat
}

export default class Ship implements IShip {
  constructor(
    private readonly baseShip: IBaseShip,
    public readonly planes: IPlane[],
    public readonly aerialCombat: ShipAerialCombat
  ) {}

  get masterId() {
    return this.baseShip.masterId
  }

  get name() {
    return this.baseShip.name
  }

  get fleetInformation() {
    return this.baseShip.fleetInformation
  }

  get shipClass() {
    return this.baseShip.shipClass
  }

  get shipType() {
    return this.baseShip.shipType
  }

  get level() {
    return this.baseShip.level
  }

  get stats() {
    return this.baseShip.stats
  }

  get nakedStats() {
    return this.baseShip.nakedStats
  }

  get slots() {
    return this.baseShip.slots
  }

  get equipments() {
    return this.baseShip.equipments
  }

  get equipmentCollection() {
    return this.baseShip.equipmentCollection
  }

  get hasEquipment() {
    return this.baseShip.hasEquipment
  }

  get countEquipment() {
    return this.baseShip.countEquipment
  }
}
