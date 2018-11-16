import { ShipClass, ShipMaster, ShipType } from '../../data'
import { EquipmentCollection, IEquipment } from '../Equipment'
import { IFleetInformation } from '../Fleet/FleetInformation'

import { IShipNakedStats } from './ShipNakedStats'
import { IShipStats } from './ShipStats'

type EquipmentIteratee = number | ((equipment: IEquipment) => boolean)

export interface IBaseShip {
  masterId: number
  name: string
  fleetInformation: IFleetInformation

  shipClass: ShipClass
  shipType: ShipType

  level: number
  stats: IShipStats
  nakedStats: IShipStats

  slots: number[]

  equipments: Array<IEquipment | undefined>
  equipmentCollection: EquipmentCollection
  hasEquipment: (iteratee: EquipmentIteratee) => boolean
  countEquipment: (iteratee?: EquipmentIteratee) => number
}

export default class BaseShip implements IBaseShip {
  public readonly slots: number[]
  constructor(
    private readonly master: ShipMaster,
    public readonly fleetInformation: IFleetInformation,
    public readonly stats: IShipStats,
    public readonly nakedStats: IShipNakedStats,
    public readonly equipmentCollection: EquipmentCollection,
    slots?: number[]
  ) {
    if (slots) {
      this.slots = slots.concat()
    } else {
      this.slots = master.slotCapacities.concat()
    }
  }

  get masterId() {
    return this.master.id
  }

  get name() {
    return this.master.name
  }

  get shipClass() {
    return this.master.shipClass
  }

  get shipType() {
    return this.master.shipType
  }

  get level() {
    return this.nakedStats.level
  }

  get equipments() {
    return this.equipmentCollection.list
  }

  public hasEquipment(iteratee: EquipmentIteratee) {
    const { equipmentCollection } = this
    if (typeof iteratee === 'number') {
      return equipmentCollection.some(equip => equip.masterId === iteratee)
    }
    return equipmentCollection.some(iteratee)
  }

  public countEquipment(iteratee?: EquipmentIteratee) {
    const { equipmentCollection } = this
    if (iteratee === undefined) {
      return equipmentCollection.nonNullableList().length
    }
    if (typeof iteratee === 'number') {
      return equipmentCollection.nonNullableList().filter(equip => equip.masterId === iteratee).length
    }
    return equipmentCollection.nonNullableList().filter(iteratee).length
  }
}
