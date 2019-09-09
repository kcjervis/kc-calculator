import { ShipData, ShipStat } from "@jervis/data"
import ShipClass from "./ShipClass"
import ShipType from "./ShipType"

type StatRange = [number, number]

const convert = (stat: ShipStat): StatRange => {
  if (typeof stat === "number") {
    return [stat, stat]
  }
  return stat
}

export default class MasterShip {
  public static readonly all = new Array<MasterShip>()

  public static readonly abyssalIdFrom = 1500

  public readonly id: number
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
  public readonly slotCapacities: readonly number[]
  public readonly equipment: ReadonlyArray<{ id: number; improvement: number }>
  public readonly remodel: Readonly<{
    nextId: number
    nextLevel: number
  }>

  public readonly equippable: {
    categories: number[]
    expantionSlot: number[]
  }

  constructor(shipData: ShipData, public readonly shipType: ShipType, public readonly shipClass: ShipClass) {
    this.id = shipData.id
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
    this.equipment = shipData.equipments.map(value => {
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
    return this.id > MasterShip.abyssalIdFrom
  }

  get canRemodel() {
    return this.remodel.nextId > 0
  }

  get canConvert() {
    const {
      id,
      remodel: { nextId }
    } = this

    const nextShip = MasterShip.all.find(ship => ship.id === nextId)
    if (!nextShip) {
      return false
    }
    return nextShip.remodel.nextId === id
  }

  get grade() {
    return this.sortId % 10
  }
}
