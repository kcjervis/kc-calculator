import { api_mst_equip_exslot } from '@jervis/data'
import { ListIterator } from 'lodash'
import { sumBy } from 'lodash-es'

import { IHealth } from './Health'
import { IMorale } from './Morale'
import { IShipNakedStats } from './ShipNakedStats'
import { IShipStats } from './ShipStats'

import { MasterShip, ShipClass, ShipType } from '../../data'
import { nonNullable, shipNameIsKai2 } from '../../utils'
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
  slotCapacities: number[]
  equipments: Array<IEquipment | undefined>
  planes: IPlane[]

  isInstallation: boolean

  canEquip: (equipment: IEquipment, slotIndex: number) => boolean

  hasEquipment: (iteratee: EquipmentIteratee<boolean, number>) => boolean
  countEquipment: (iteratee?: EquipmentIteratee<boolean, number>) => number
  totalEquipmentStats: (iteratee: ((equip: IEquipment) => number) | keyof IEquipment) => number

  canNightAttack: boolean
}

export default class Ship implements IShip {
  public slotCapacities: number[]

  constructor(
    private readonly master: MasterShip,
    public readonly stats: IShipStats,
    public readonly nakedStats: IShipNakedStats,
    public readonly health: IHealth,
    public readonly morale: IMorale,
    public readonly slots: number[],
    public readonly equipments: Array<IEquipment | undefined>,
    public readonly planes: IPlane[]
  ) {
    this.slotCapacities = master.slotCapacities.concat()
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

  get isInstallation() {
    return this.nakedStats.speed === 0
  }

  get nonNullableEquipments() {
    return this.equipments.filter(nonNullable)
  }

  public canEquip = (equipment: IEquipment, slotIndex: number) => {
    const { equippable } = this.master
    const { masterId, category } = equipment

    if (!equippable.categories.includes(category.id)) {
      return false
    }

    if (this.slots.length <= slotIndex) {
      const turbine = 33
      return (
        api_mst_equip_exslot.includes(category.id) ||
        equippable.expantionSlot.includes(masterId) ||
        masterId === turbine
      )
    }

    if (this.shipClass.is('IseClass') && shipNameIsKai2(this.name)) {
      return !(slotIndex > 1 && category.isMainGun)
    }

    return true
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

  get canNightAttack() {
    const { shipClass, shipType, health, master } = this
    if (health.damage === 'Heavy') {
      return false
    }

    if (shipClass.is('ArkRoyalClass')) {
      const swordfishes = [242, 243, 244]
      return health.damage !== 'Moderate' && this.hasEquipment(equip => swordfishes.includes(equip.masterId))
    }
    return master.firepower[0] > 0
  }
}
