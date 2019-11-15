import { GearStats } from "../types"
import { IGear, IShip } from "../objects"
import { GearQuery } from "../objects/gear/Gear"
import { GearId, ShipClassId, ShipId } from "@jervis/data"
import { ShipQuery } from "../objects/ship/ship"
import { GearCategoryId } from "./GearCategory"
import { SiftQuery } from "sift"
import ShipTypeId from "./ShipTypeId"

const positions = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "a9",
  "a10",
  "a11",
  "a12",
  "a13",
  "a13next",
  "a14",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "b10",
  "b11",
  "b12",
  "b13",
  "b13next",
  "b14"
] as const

type AttackPowerModifierPosition = typeof positions[number]

type NumberRecord<T extends string> = { [K in T]?: number }

export type AttackPowerModifier = NumberRecord<AttackPowerModifierPosition>

type CountRule<T> = {
  count1?: T
  count2?: T
  count3?: T
  count4?: T
  count5?: T
}

type AttackCondition = {
  gear?: GearQuery
  ship?: ShipQuery
  target?: ShipQuery
}

type SpecialEnemyModifierRule = AttackCondition &
  CountRule<AttackPowerModifier> & {
    bonus?: AttackPowerModifier
    rules?: SpecialEnemyModifierRule[]
  }

/** 陸上 */
const isInstallation: ShipQuery = { attrs: "Installation" }
/** 砲台 */
const isPillbox: ShipQuery = { attrs: "Pillbox" }
/** 離島 */
const isIsolatedIsland: ShipQuery = { attrs: "IsolatedIsland" }
/** ソフトスキン */
const isSoftSkinned: ShipQuery = { attrs: "SoftSkinned" }
/** 港湾夏姫 */
const isHarbourSummerPrincess: ShipQuery = { shipClassId: ShipClassId.HarbourSummerPrincess }
/** 集積 */
const isSupplyDepot: ShipQuery = { attrs: "SupplyDepot" }

const or = <T>(...args: Array<SiftQuery<T>>): SiftQuery<T> => ({ $or: [...args] })

export const mergeAttackPowerModifier = (...args: AttackPowerModifier[]) => {
  const result: AttackPowerModifier = {}

  const setValue = (key: AttackPowerModifierPosition, value: number) => {
    let next: number
    if (key.startsWith("a")) {
      next = (result[key] || 1) * value
    } else {
      next = (result[key] || 0) + value
    }
    result[key] = next
  }
  const setModifier = (mod: AttackPowerModifier) => {
    positions.forEach(key => {
      const value = mod[key]
      if (value) {
        setValue(key, value)
      }
    })
  }

  args.forEach(setModifier)

  return result
}

const data: SpecialEnemyModifierRule[] = [
  {
    gear: { categoryId: GearCategoryId.AntiAircraftShell },
    rules: [
      {
        target: or(isIsolatedIsland, isHarbourSummerPrincess),
        count1: { a13: 1.75 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 2.5 }
      }
    ]
  },

  {
    gear: { categoryId: GearCategoryId.ArmorPiercingShell },
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.85 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.3 }
      }
    ]
  },

  {
    gear: GearId["WG42 (Wurfgerät 42)"],
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.6 },
        count2: { a13: 2.72 }
      },
      {
        target: isIsolatedIsland,
        count1: { a13: 1.4 },
        count2: { a13: 2.1 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.3 },
        count2: { a13: 1.82 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.4 },
        count2: { a13: 1.68 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.25 },
        count2: { a5: 1.625 }
      },
      {
        target: isInstallation,
        count1: { b13next: 75 },
        count2: { b13next: 110 },
        count3: { b13next: 140 },
        count4: { b13next: 160 }
      }
    ]
  },

  {
    gear: { attrs: "AntiGroundRocketLauncher" },
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.5 },
        count2: { a13: 2.7 }
      },
      {
        target: isIsolatedIsland,
        count1: { a13: 1.3 },
        count2: { a13: 2.145 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.25 },
        count2: { a13: 1.875 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.25 },
        count2: { a13: 1.75 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.2 },
        count2: { a5: 1.68 }
      }
    ]
  },

  {
    gear: GearId["艦載型 四式20cm対地噴進砲"],
    rules: [
      {
        target: isInstallation,
        count1: { b13next: 55 },
        count2: { b13next: 115 },
        count3: { b13next: 160 },
        count4: { b13next: 190 }
      }
    ]
  },

  {
    gear: GearId["四式20cm対地噴進砲 集中配備"],
    rules: [
      {
        target: isInstallation,
        count1: { b13next: 80 },
        count2: { b13next: 170 }
      }
    ]
  },

  {
    gear: { attrs: "Mortar" },
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.3 },
        count2: { a13: 1.95 }
      },
      {
        target: isIsolatedIsland,
        count1: { a13: 1.2 },
        count2: { a13: 1.68 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.2 },
        count2: { a13: 1.56 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.1 },
        count2: { a13: 1.265 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.15 },
        count2: { a5: 1.38 }
      }
    ]
  },

  {
    gear: GearId["二式12cm迫撃砲改"],
    rules: [
      {
        target: isInstallation,
        count1: { b13next: 30 },
        count2: { b13next: 55 },
        count3: { b13next: 75 },
        count4: { b13next: 90 }
      }
    ]
  },

  {
    gear: GearId["二式12cm迫撃砲改 集中配備"],
    rules: [
      {
        target: isInstallation,
        count1: { b13next: 60 },
        count2: { b13next: 110 },
        count3: { b13next: 150 }
      }
    ]
  },

  {
    gear: { categoryId: GearCategoryId.LandingCraft },
    rules: [
      {
        target: or(isPillbox, isIsolatedIsland),
        count1: { a13: 1.8 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.4 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.7 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.7 }
      }
    ]
  },

  {
    gear: GearId["特大発動艇"],
    rules: [
      {
        target: or(isPillbox, isIsolatedIsland, isSoftSkinned),
        count1: { a13: 1.15 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.2 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.2 }
      }
    ]
  },

  {
    gear: GearId["大発動艇(八九式中戦車&陸戦隊)"],
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.5 },
        count2: { a13: 2.1 }
      },
      {
        target: isIsolatedIsland,
        count1: { a13: 1.2 },
        count2: { a13: 1.68 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.5 },
        count2: { a13: 1.95 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.6 },
        count2: { a13: 2.4 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.3 },
        count2: { a5: 2.08 }
      }
    ]
  },

  {
    gear: GearId["特大発動艇+戦車第11連隊"],
    rules: [
      {
        target: isInstallation,
        count1: { a13: 1.8, b13: 25 }
      }
    ]
  },

  {
    gear: GearId["M4A1 DD"],
    rules: [
      {
        target: isSoftSkinned,
        count1: { a13: 1.1 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 2 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.2 }
      },
      {
        target: isInstallation,
        count1: { b13: 25, a13next: 1.4 }
      }
    ]
  },

  {
    gear: GearId["特二式内火艇"],
    rules: [
      {
        target: or(isPillbox, isIsolatedIsland),
        count1: { a13: 2.4 },
        count2: { a13: 3.24 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.5 },
        count2: { a13: 1.8 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 2.8 },
        count2: { a13: 4.2 }
      },
      {
        target: isSupplyDepot,
        count1: { a5: 1.7 },
        count2: { a5: 2.55 }
      }
    ]
  },

  {
    gear: { categoryId: GearCategoryId.CarrierBasedDiveBomber },
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.5 }
      },
      {
        target: isIsolatedIsland,
        count1: { a13: 1.4 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.3 }
      }
    ]
  },

  {
    gear: { categoryId: { $in: [GearCategoryId.SeaplaneBomber, GearCategoryId.SeaplaneFighter] } },
    rules: [
      {
        target: isPillbox,
        count1: { a13: 1.5 }
      },
      {
        target: isSoftSkinned,
        count1: { a13: 1.2 }
      },
      {
        target: isHarbourSummerPrincess,
        count1: { a13: 1.3 }
      }
    ]
  },

  // 艦種補正
  {
    ship: { shipTypeId: { $in: [ShipTypeId.Destroyer, ShipTypeId.LightCruiser] } },
    target: isPillbox,
    bonus: { a13: 1.4 }
  },

  {
    ship: { shipTypeId: { $in: [ShipTypeId.Submarine, ShipTypeId.SubmarineAircraftCarrier] } },
    target: isInstallation,
    bonus: { b12: 30 }
  }
]

const matchRule = (rule: AttackCondition, ship: IShip, target: IShip) => {
  const { ship: shipCond, target: targetCond } = rule

  if (shipCond && !ship.match(shipCond)) {
    return false
  }
  if (targetCond && !target.match(targetCond)) {
    return false
  }
  return true
}

const countRuleToModifier = (rule: SpecialEnemyModifierRule, qty: number) => {
  const { count1, count2, count3, count4, count5 } = rule
  let modifier: AttackPowerModifier = {}
  ;[count1, count2, count3, count4, count5].forEach((record, index) => {
    if (record && qty > index) {
      modifier = record
    }
  })
  return modifier
}

const makeModifiersCreater = (ship: IShip, target: IShip) => {
  const createModifiers = (rule: SpecialEnemyModifierRule, inheritedCount = 0): AttackPowerModifier[] => {
    const result: AttackPowerModifier[] = []
    if (!matchRule(rule, ship, target)) {
      return result
    }
    const { gear: gearCond, bonus, rules } = rule
    const count = gearCond ? ship.countGear(gear => gear.match(gearCond)) : inheritedCount

    if (count) {
      result.push(countRuleToModifier(rule, count))
    }
    if (bonus) {
      result.push(bonus)
    }
    if (rules) {
      result.push(...rules.flatMap(r => createModifiers(r, count)))
    }
    return result
  }

  return createModifiers
}

const getLandingCraftImprovementModifier = (ship: IShip, targetIsSupplyDepot: boolean) => {
  const count = ship.countGear("LandingCraft")
  const modifier: AttackPowerModifier = {}
  if (count) {
    const totalStar = ship.totalEquipmentStats(gear => (gear.is("LandingCraft") ? gear.star : 0))
    modifier.a13 = 1 + totalStar / count / 50

    if (!targetIsSupplyDepot) {
      return modifier
    }
    modifier.a5 = modifier.a13
    if (ship.hasGear(GearId["大発動艇(八九式中戦車&陸戦隊)"])) {
      modifier.a5 *= modifier.a5
    }
  }

  return modifier
}

const getTankImprovementModifier = (ship: IShip, targetIsSupplyDepot: boolean) => {
  const count = ship.countGear(GearId["特二式内火艇"])
  const modifier: AttackPowerModifier = {}
  if (count) {
    const totalStar = ship.totalEquipmentStats(gear => (gear.match(GearId["特二式内火艇"]) ? gear.star : 0))
    modifier.a13 = 1 + totalStar / count / 30

    if (!targetIsSupplyDepot) {
      return modifier
    }
    modifier.a5 = modifier.a13
  }

  return modifier
}

const getImprovementModifiers = (ship: IShip, target: IShip) => {
  const targetIsSupplyDepot = target.is("SupplyDepot")
  return [
    getLandingCraftImprovementModifier(ship, targetIsSupplyDepot),
    getTankImprovementModifier(ship, targetIsSupplyDepot)
  ]
}

export const getSpecialEnemyModifier = (ship: IShip, target: IShip): AttackPowerModifier => {
  const createModifiers = makeModifiersCreater(ship, target)
  const modifiers = data.flatMap(rule => createModifiers(rule))
  const improvementModifiers = getImprovementModifiers(ship, target)

  return mergeAttackPowerModifier(...modifiers, ...improvementModifiers)
}
