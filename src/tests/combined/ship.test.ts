import { ObjectFactory, IShip } from "../../objects"
import { mapValues, mergeWith } from "lodash-es"

const kcObjectFactory = new ObjectFactory()

type Bonus = {
  firepower?: number
}

type EquipmentBonus = {
  multiple?: Bonus
  count1?: Bonus
  count2?: Bonus
  count3?: Bonus
  count4?: Bonus
}

const multiplyBonus = (bonus: Bonus, multiplier: number) => mapValues(bonus, stat => stat && stat * multiplier)
const addBonus = (bonus: Bonus, other: Bonus) => mergeWith(bonus, other, (stat0 = 0, stat1 = 0) => stat0 + stat1)

const bonus = {
  multiple: { firepower: 2, asw: 1 }
}

const getEquipmentBonus = (ship: IShip) => {
  if (!ship.match({ shipId: 1 })) {
    return {}
  }
  const count = ship.countGear(gear => gear.match({ gearId: 229 }))
  return multiplyBonus(bonus.multiple, count)
}

describe("ship", () => {
  const ship = kcObjectFactory.createShip({ masterId: 1, equipments: [{ masterId: 229 }, { masterId: 229 }] })
  if (!ship) {
    return
  }

  it("match", () => {
    expect(ship.match({ shipId: 1, shipTypeId: 1 })).toBe(false)
    expect(ship.match({ shipId: 1, shipTypeId: 2 })).toBe(true)
  })
})
