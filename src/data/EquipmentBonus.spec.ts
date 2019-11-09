import {
  multiplyBonus,
  addBonus,
  getEquipmentBonus,
  StatBonusRuleBase,
  StatsBonusRecord,
  shipStatKeys
} from "./EquipmentBonus"
import { ObjectFactory, IGearDataObject, IShip } from "../objects"
import { GearId, ShipClassId, ShipId, ShipName, GearName } from "@jervis/data"
import { MasterData } from "."
import { range, isEqual, mergeWith } from "lodash-es"

const data = new MasterData()
const factory = new ObjectFactory(data)

type GearState = GearName | { name: GearName; star?: number }

export const subBonus = (bonus: StatsBonusRecord, other: StatsBonusRecord) => {
  const result: StatsBonusRecord = {}
  for (const key of shipStatKeys) {
    const stat = (bonus[key] || 0) - (other[key] || 0)
    if (stat !== 0) result[key] = stat
  }
  return result
}

const toGearData = (state: GearState): IGearDataObject => {
  if (typeof state === "string") {
    state = { name: state }
  }
  const { name, star } = state
  const id = data.gearNameToId(name)
  if (!id) {
    throw Error(`${name} is not found`)
  }
  return { masterId: id, improvement: star }
}

const toShipId = (name: ShipName) => {
  const shipId = data.shipNameToId(name)
  if (!shipId) {
    throw Error(`${name} is not found`)
  }
  return shipId
}

const getGears = (state: GearState, qty: number) => Array.from({ length: qty }, () => state)

const makeBonus = (shipName: ShipName, ...gears: GearState[]) => {
  const shipId = toShipId(shipName)
  const ship = factory.createShip({ masterId: shipId, equipments: gears.map(toGearData) })
  if (!ship) {
    throw Error(`${shipId} is not found`)
  }
  return getEquipmentBonus(ship)
}

const isMultiple = (bonuses: StatsBonusRecord[]) => {
  const count1 = bonuses[0]
  return bonuses.every((bonus, index) => {
    const qty = index + 1
    return isEqual(multiplyBonus(count1, qty), bonus)
  })
}

const bonusesToExpect = (bonuses: StatsBonusRecord[]) => {
  const [count1, count2, count3, count4] = bonuses
  let result: StatBonusRuleBase = { count1, count2, count3, count4 }

  if (isEqual(count1, count2)) {
    delete result.count2
  }
  if (isEqual(count2, count3)) {
    delete result.count3
  }
  if (isEqual(count3, count4)) {
    delete result.count4
  }
  if (isMultiple(bonuses)) {
    result = { multiple: count1 }
  }

  const toEqual = (rule: StatBonusRuleBase) => expect(result).toEqual(rule)
  const toMultiple = (bonus: StatsBonusRecord) => toEqual({ multiple: bonus })
  const toCount1 = (bonus: StatsBonusRecord) => toEqual({ count1: bonus })
  const toCount2 = (bonus: StatsBonusRecord) => toEqual({ count2: bonus })
  const toNonBonus = () => toEqual({ multiple: {} })

  return { toEqual, toMultiple, toCount1, toCount2, toNonBonus }
}

const expectBonus = (shipName: ShipName, equipmentState: GearState) => {
  const getBonus = (qty: number) => makeBonus(shipName, ...getGears(equipmentState, qty))

  const bonuses = range(4).map(num => {
    const qty = num + 1
    return getBonus(qty)
  })
  return bonusesToExpect(bonuses)
}

const expectSynergy = (shipName: ShipName, gear1: GearState, gear2: GearState) => {
  const getBonus = (...params: GearState[]) => makeBonus(shipName, ...params)

  const getSynergyBonus = (qty: number) => {
    const bonus1 = getBonus(gear1)
    const bonus2 = getBonus(...getGears(gear2, qty))
    const bonus3 = getBonus(gear1, ...getGears(gear2, qty))
    return subBonus(bonus3, addBonus(bonus1, bonus2))
  }

  const bonuses = range(4).map(num => {
    const qty = num + 1
    return getSynergyBonus(qty)
  })

  return bonusesToExpect(bonuses)
}

describe("EquipmentBonus", () => {
  it("multiplyBonus", () => {
    expect(multiplyBonus({ firepower: 1, asw: 2 }, 2)).toEqual({ firepower: 2, asw: 4 })
  })

  it("addBonus", () => {
    expect(addBonus({ firepower: 1 }, { firepower: 2 })).toEqual({ firepower: 3 })
    expect(addBonus({ firepower: 1, asw: 3 }, { firepower: 1, los: 4 })).toEqual({ firepower: 2, asw: 3, los: 4 })
    expect(addBonus({ firepower: 1 }, { firepower: -1 })).toEqual({})
  })

  describe("小口径主砲", () => {
    it("12.7cm連装砲A型改二", () => {
      expectBonus("吹雪", "12.7cm連装砲A型改二").toMultiple({ firepower: 1 })

      expectSynergy("暁", "12.7cm連装砲A型改二", "22号対水上電探").toCount1({ firepower: 3, torpedo: 1, evasion: 2 })
      expectSynergy("暁", "12.7cm連装砲A型改二", "61cm三連装魚雷").toEqual({
        count1: { firepower: 1, torpedo: 3 },
        count2: { firepower: 2, torpedo: 5 }
      })
      expectSynergy("暁", "12.7cm連装砲A型改二", "61cm三連装(酸素)魚雷後期型").toEqual({
        count1: { firepower: 1, torpedo: 4 },
        count2: { firepower: 2, torpedo: 6 }
      })

      expect(makeBonus("暁", "12.7cm連装砲A型改二", "61cm三連装魚雷", "61cm三連装(酸素)魚雷後期型")).toEqual({
        firepower: 3,
        torpedo: 6
      })
    })

    it("12.7cm連装砲A型改三(戦時改修)+高射装置", () => {
      expectSynergy("綾波", "12.7cm連装砲A型改三(戦時改修)+高射装置", "22号対水上電探").toCount1({
        firepower: 3,
        torpedo: 1,
        evasion: 2
      })
      expectSynergy("綾波", "12.7cm連装砲A型改三(戦時改修)+高射装置", "13号対空電探").toCount1({ antiAir: 6 })
      expectSynergy("綾波", "12.7cm連装砲A型改三(戦時改修)+高射装置", "61cm三連装魚雷").toEqual({
        count1: { firepower: 1, torpedo: 3 },
        count2: { firepower: 2, torpedo: 5 }
      })
      expectSynergy("綾波", "12.7cm連装砲A型改三(戦時改修)+高射装置", "61cm三連装(酸素)魚雷後期型").toEqual({
        count1: { firepower: 1, torpedo: 4 },
        count2: { firepower: 2, torpedo: 6 }
      })
    })

    it("12.7cm連装砲B型改四(戦時改修)+高射装置", () => {
      expectSynergy("綾波", "12.7cm連装砲B型改四(戦時改修)+高射装置", "22号対水上電探").toCount1({
        firepower: 1,
        torpedo: 2,
        evasion: 2
      })
      expectSynergy("白露", "12.7cm連装砲B型改四(戦時改修)+高射装置", "22号対水上電探").toCount1({
        firepower: 1,
        torpedo: 3,
        evasion: 2
      })

      expectSynergy("綾波", "12.7cm連装砲B型改四(戦時改修)+高射装置", "13号対空電探").toCount1({ antiAir: 5 })
      expectSynergy("白露", "12.7cm連装砲B型改四(戦時改修)+高射装置", "13号対空電探").toCount1({ antiAir: 6 })

      expectSynergy("綾波", "12.7cm連装砲B型改四(戦時改修)+高射装置", "61cm三連装(酸素)魚雷後期型").toCount1({
        firepower: 1,
        torpedo: 3
      })
      expectSynergy("白露", "12.7cm連装砲B型改四(戦時改修)+高射装置", "61cm四連装(酸素)魚雷後期型").toCount1({
        firepower: 1,
        torpedo: 3
      })
    })

    it("12.7cm連装砲C型改二", () => {
      expectBonus("陽炎改二", "12.7cm連装砲C型改二").toEqual({
        count1: { firepower: 2 },
        count2: { firepower: 5 },
        count3: { firepower: 6 },
        count4: { firepower: 7 }
      })
      expectBonus("陽炎", "12.7cm連装砲C型改二").toMultiple({ firepower: 1 })

      expectSynergy("白露", "12.7cm連装砲C型改二", "22号対水上電探").toCount1({
        firepower: 1,
        torpedo: 3,
        evasion: 1
      })
      expectSynergy("陽炎", "12.7cm連装砲C型改二", "22号対水上電探").toCount1({
        firepower: 2,
        torpedo: 3,
        evasion: 1
      })
    })

    it("12.7cm連装砲D型改二", () => {
      expectBonus("夕雲改二", "12.7cm連装砲D型改二").toMultiple({ firepower: 3, evasion: 1 })

      expectBonus("陽炎改二", "12.7cm連装砲D型改二").toEqual({
        count1: { firepower: 2, evasion: 1 },
        count2: { firepower: 3, evasion: 2 },
        count3: { firepower: 4, evasion: 3 },
        count4: { firepower: 5, evasion: 4 }
      })

      expectSynergy("夕雲改二", "12.7cm連装砲D型改二", "22号対水上電探").toCount1({
        firepower: 3,
        torpedo: 4,
        evasion: 3
      })
      expectSynergy("夕雲", "12.7cm連装砲D型改二", "22号対水上電探").toCount1({
        firepower: 2,
        torpedo: 3,
        evasion: 1
      })
      expectSynergy("島風改", "12.7cm連装砲D型改二", "22号対水上電探").toCount1({
        firepower: 1,
        torpedo: 3,
        evasion: 2
      })
      expectSynergy("島風", "12.7cm連装砲D型改二", "22号対水上電探").toNonBonus()
    })

    it("12cm単装砲改二", () => {
      expectSynergy("神風", "12cm単装砲改二", "22号対水上電探").toCount1({
        firepower: 2,
        torpedo: 1,
        evasion: 3
      })
      expectSynergy("占守", "12cm単装砲改二", "22号対水上電探").toCount1({
        firepower: 2,
        evasion: 3,
        asw: 1
      })

      expectSynergy("神風", "12cm単装砲改二", "53cm連装魚雷").toEqual({
        count1: { firepower: 2, torpedo: 4 },
        count2: { firepower: 3, torpedo: 7 }
      })
    })

    it("12.7cm単装高角砲(後期型)", () => {
      expectBonus("神風", { name: "12.7cm単装高角砲(後期型)", star: 6 }).toNonBonus()
      expectBonus("神風", { name: "12.7cm単装高角砲(後期型)", star: 7 }).toMultiple({ firepower: 1, antiAir: 1 })

      expectSynergy("神風", { name: "12.7cm単装高角砲(後期型)", star: 7 }, "22号対水上電探").toCount1({
        firepower: 2,
        evasion: 3
      })
      expectSynergy("占守", { name: "12.7cm単装高角砲(後期型)", star: 7 }, "22号対水上電探").toCount1({
        firepower: 1,
        evasion: 4
      })
      expectSynergy("由良改二", { name: "12.7cm単装高角砲(後期型)", star: 7 }, "22号対水上電探").toCount1({
        firepower: 3,
        evasion: 2
      })
    })
  })

  describe("中口径主砲", () => {
    it("20.3cm(2号)連装砲", () => {
      expectSynergy("古鷹", "20.3cm(2号)連装砲", "22号対水上電探").toCount1({ firepower: 3, torpedo: 2, evasion: 2 })
      expectSynergy("青葉", "20.3cm(2号)連装砲", "13号対空電探").toCount1({ antiAir: 5, evasion: 2 })
    })
  })

  describe("大口径主砲", () => {
    it("35.6cm三連装砲改(ダズル迷彩仕様)", () => {
      expectSynergy("金剛改二", "35.6cm三連装砲改(ダズル迷彩仕様)", "22号対水上電探").toCount1({
        firepower: 2,
        evasion: 2
      })
    })
  })

  describe("魚雷", () => {
    it("61cm四連装(酸素)魚雷後期型", () => {
      expectBonus("陽炎改二", { name: "61cm四連装(酸素)魚雷後期型", star: 5 }).toEqual({
        count1: { torpedo: 3, evasion: 1 },
        count2: { torpedo: 6, evasion: 2 }
      })
      expectBonus("陽炎改二", { name: "61cm四連装(酸素)魚雷後期型", star: 10 }).toEqual({
        count1: { firepower: 1, torpedo: 3, evasion: 1 },
        count2: { firepower: 2, torpedo: 6, evasion: 2 }
      })
    })
  })

  describe("機関部強化", () => {
    it("速力", () => {
      expectBonus("Samuel B.Roberts", "改良型艦本式タービン").toCount1({ speed: 5 })
    })
  })

  describe("艦上偵察機", () => {
    it("二式艦上偵察機", () => {
      expectBonus("伊勢改二", { name: "二式艦上偵察機", star: 1 }).toCount1({
        firepower: 3,
        evasion: 2,
        armor: 1,
        range: 1
      })
      expectBonus("伊勢改二", { name: "二式艦上偵察機", star: 2 }).toCount1({
        firepower: 3,
        evasion: 2,
        armor: 1,
        los: 1,
        effectiveLos: 1,
        range: 1
      })
      expectBonus("伊勢改二", { name: "二式艦上偵察機", star: 4 }).toCount1({
        firepower: 4,
        evasion: 2,
        armor: 1,
        los: 1,
        effectiveLos: 1,
        range: 1
      })
      expectBonus("伊勢改二", { name: "二式艦上偵察機", star: 6 }).toCount1({
        firepower: 4,
        evasion: 2,
        armor: 1,
        los: 2,
        effectiveLos: 2,
        range: 1
      })
      expectBonus("伊勢改二", { name: "二式艦上偵察機", star: 10 }).toCount1({
        firepower: 5,
        evasion: 2,
        armor: 1,
        los: 3,
        effectiveLos: 3,
        range: 1
      })

      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 0 }).toNonBonus()
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 1 }).toCount1({
        firepower: 3,
        los: 3,
        effectiveLos: 3
      })
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 2 }).toCount1({
        firepower: 3,
        los: 4,
        effectiveLos: 4
      })
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 4 }).toCount1({
        firepower: 4,
        los: 4,
        effectiveLos: 4
      })
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 6 }).toCount1({
        firepower: 4,
        los: 5,
        effectiveLos: 5
      })
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 8 }).toCount1({
        firepower: 5,
        los: 6,
        effectiveLos: 6
      })
      expectBonus("蒼龍改", { name: "二式艦上偵察機", star: 10 }).toCount1({
        firepower: 6,
        los: 7,
        effectiveLos: 7
      })
    })
  })
})
