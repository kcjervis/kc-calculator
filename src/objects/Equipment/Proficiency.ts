import { EquipmentCategoryId, MasterEquipment } from '../../data'

export interface IProficiency {
  internal: number
  level: number
  fighterPowerBonus: number
}

/** 熟練度 */
export default class Proficiency implements IProficiency {
  public static readonly internalBounds = [0, 10, 25, 40, 55, 70, 85, 100]

  public static readonly fighterPowerBonuses = {
    fighterBonuses: [
      { bound: 100, value: 22 },
      { bound: 70, value: 14 },
      { bound: 55, value: 9 },
      { bound: 40, value: 5 },
      { bound: 25, value: 2 },
      { bound: 0, value: 0 }
    ],
    seaplaneBomberBonuses: [
      { bound: 100, value: 6 },
      { bound: 70, value: 3 },
      { bound: 25, value: 1 },
      { bound: 0, value: 0 }
    ]
  }

  public static internalToLevel(internal: number) {
    return Proficiency.internalBounds.filter(bound => bound <= internal).length - 1
  }

  constructor(public internal = 0, private readonly master: MasterEquipment) {}

  get level() {
    return Proficiency.internalToLevel(this.internal)
  }

  set level(value: number) {
    this.internal = Proficiency.internalBounds[value]
  }

  get fighterPowerBonus() {
    const { internal, master } = this
    if (internal <= 0) {
      return 0
    }

    const internalBonus = Math.sqrt(internal / 10)

    const { fighterBonuses, seaplaneBomberBonuses } = Proficiency.fighterPowerBonuses
    if (master.category.isFighter) {
      for (const { bound, value } of fighterBonuses) {
        if (bound <= internal) {
          return value + internalBonus
        }
      }
    } else if (master.category.id === EquipmentCategoryId.SeaplaneBomber) {
      for (const { bound, value } of seaplaneBomberBonuses) {
        if (bound <= internal) {
          return value + internalBonus
        }
      }
    }
    return internalBonus
  }
}
