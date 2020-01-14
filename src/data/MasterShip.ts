import { ShipData, ShipStat } from "@jervis/data"
import ShipClass from "./ShipClass"
import ShipType from "./ShipType"

type StatRange = [number, number]

export type Equippable = {
  categories: number[]
  expantionSlot: number[]
}

export type ShipBase = {
  shipId: number
  shipClassId: number

  sortId: number
  name: string
  readingName: string
  hp: StatRange
  armor: StatRange
  firepower: StatRange
  torpedo: StatRange
  antiAir: StatRange
  luck: StatRange
  asw: StatRange
  evasion: StatRange
  los: StatRange
  speed: number
  range: number
  fuel: number
  ammo: number
  slotCapacities: number[]
  initialEquipment: Array<{ id: number; improvement: number }>
  equippable: Equippable
}

const convert = (stat: ShipStat): StatRange => {
  if (typeof stat === "number") {
    return [stat, stat]
  }
  return stat
}

export default class MasterShip implements ShipBase {
  public static readonly all = new Array<MasterShip>()

  public static readonly abyssalIdFrom = 1500

  public readonly shipId: number
  public readonly shipClassId: number

  public readonly sortNo: number
  public readonly sortId: number
  public readonly name: string
  public readonly readingName: string
  public readonly hp: StatRange
  public readonly armor: StatRange
  public readonly firepower: StatRange
  public readonly torpedo: StatRange
  public readonly antiAir: StatRange
  public readonly luck: StatRange
  public readonly asw: StatRange
  public readonly evasion: StatRange
  public readonly los: StatRange
  public readonly speed: number
  public readonly range: number
  public readonly fuel: number
  public readonly ammo: number
  public readonly slotCapacities: number[]
  public readonly initialEquipment: Array<{ id: number; improvement: number }>
  public readonly remodel: Readonly<{
    nextId: number
    nextLevel: number
  }>

  public readonly equippable: {
    categories: number[]
    expantionSlot: number[]
  }

  constructor(shipData: ShipData, public readonly shipType: ShipType, public readonly shipClass: ShipClass) {
    this.shipId = shipData.id
    this.shipClassId = shipClass.id

    this.sortNo = shipData.sortNo
    this.sortId = shipData.sortId
    this.name = shipData.name
    this.readingName = shipData.readingName

    this.hp = convert(shipData.hp)
    this.armor = convert(shipData.armor)
    this.firepower = convert(shipData.firepower)
    this.torpedo = convert(shipData.torpedo)
    this.antiAir = convert(shipData.antiAir)
    this.luck = convert(shipData.luck)
    this.asw = convert(shipData.asw)
    this.evasion = convert(shipData.evasion)
    this.los = convert(shipData.los)

    this.speed = shipData.speed
    this.range = shipData.range
    this.fuel = shipData.fuel
    this.ammo = shipData.ammo
    this.slotCapacities = shipData.slotCapacities.concat()
    this.initialEquipment = shipData.equipments.map(value => {
      if (typeof value === "number") {
        return { id: value, improvement: 0 }
      }
      return value
    })

    if (shipData.remodel) {
      this.remodel = shipData.remodel
    } else {
      this.remodel = {
        nextId: 0,
        nextLevel: 0
      }
    }

    const equippable = shipData.equippable ? shipData.equippable : {}
    this.equippable = {
      categories: this.shipType.equippableCategoryIds,
      expantionSlot: [],
      ...equippable
    }

    MasterShip.all.push(this)
  }

  get isAbyssal() {
    return this.shipId > MasterShip.abyssalIdFrom
  }

  get canRemodel() {
    return this.remodel.nextId > 0
  }

  private getNextShip = () => {
    if (!this.canRemodel) {
      return
    }
    return MasterShip.all.find(ship => this.remodel.nextId === ship.shipId)
  }

  private getPrevShip = () => {
    return MasterShip.all.find(ship => ship.remodel.nextId === this.shipId)
  }

  get canConvert() {
    const ships: MasterShip[] = []

    while (!ships.includes(this)) {
      const nextShip = this.getNextShip()
      if (!nextShip) {
        return false
      }
      ships.push(nextShip)
    }

    return true
  }

  get remodelGroup() {
    let remodelGroup = this.shipId
    let found = this.getPrevShip()
    while (found) {
      remodelGroup = found.shipId
      found = found.getPrevShip()
    }
    return remodelGroup
  }
  get rank() {
    return this.sortId % 10
  }
}
