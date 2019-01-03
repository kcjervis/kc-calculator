import { ListIterator } from 'lodash'
import sumBy from 'lodash/sumBy'

import { IHealth } from './Health'
import { IMorale } from './Morale'
import { IShipNakedStats } from './ShipNakedStats'
import { IShipStats } from './ShipStats'

import { MasterShip, ShipClass, ShipType } from '../../data'
import { nonNullable } from '../../utils'
import { IEquipment } from '../Equipment'
import { IPlane } from '../Plane'

type EquipmentIterator<R> = ListIterator<IEquipment, R>
type EquipmentIteratee<R, S> = EquipmentIterator<R> | S

export interface IShip {
  masterId: number
  name: string

  shipClass: ShipClass
  shipType: ShipType

  level: number
  stats: IShipStats
  nakedStats: IShipStats

  health: IHealth
  morale: IMorale

  slots: number[]
  equipments: Array<IEquipment | undefined>
  planes: IPlane[]

  hasEquipment: (iteratee: EquipmentIteratee<boolean, number>) => boolean
  countEquipment: (iteratee?: EquipmentIteratee<boolean, number>) => number
  totalEquipmentStats: (iteratee: ((equip: IEquipment) => number) | keyof IEquipment) => number
}

export default class Ship implements IShip {
  constructor(
    private readonly master: MasterShip,
    public readonly stats: IShipStats,
    public readonly nakedStats: IShipNakedStats,
    public readonly health: IHealth,
    public readonly morale: IMorale,
    public readonly slots: number[],
    public readonly equipments: Array<IEquipment | undefined>,
    public readonly planes: IPlane[]
  ) {}

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

  get nonNullableEquipments() {
    return this.equipments.filter(nonNullable)
  }

  public hasEquipment = (iteratee: EquipmentIteratee<boolean, number>) => {
    if (typeof iteratee === 'number') {
      return this.nonNullableEquipments.some(({ masterId }) => masterId === iteratee)
    }
    return this.nonNullableEquipments.some(iteratee)
  }

  public countEquipment = (iteratee?: EquipmentIteratee<boolean, number>) => {
    const { nonNullableEquipments } = this
    if (iteratee === undefined) {
      return nonNullableEquipments.length
    }
    if (typeof iteratee === 'number') {
      return nonNullableEquipments.filter(({ masterId }) => masterId === iteratee).length
    }
    return nonNullableEquipments.filter(iteratee).length
  }

  public totalEquipmentStats = (iteratee: ((equip: IEquipment) => number) | keyof IEquipment) => {
    return sumBy(this.nonNullableEquipments, iteratee)
  }
}
