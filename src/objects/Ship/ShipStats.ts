import { maxBy, sumBy } from "lodash-es"
import { IGear } from "../gear"
import { isNonNullable, includes } from "../../utils"
import ShipNakedStats, { IBaseStats } from "./ShipNakedStats"
import { StatsBonusRecord, shipStatKeys } from "../../data/EquipmentBonus"

export interface IShipStats extends IBaseStats {
  equipmentBonus: StatsBonusRecord
  getBonus: (key: keyof StatsBonusRecord | keyof IBaseStats) => number
}

export default class ShipStats implements IShipStats {
  constructor(
    private readonly nakedStats: ShipNakedStats,
    private readonly gears: Array<IGear | undefined>,
    public equipmentBonus: StatsBonusRecord = {}
  ) {}

  public getBonus = (key: keyof StatsBonusRecord | keyof IBaseStats) => {
    const { equipmentBonus } = this
    if (includes(shipStatKeys, key)) {
      return equipmentBonus[key] || 0
    }
    return 0
  }

  private getStat(key: keyof Omit<StatsBonusRecord, "effectiveLos" | "accuracy">) {
    const { nakedStats, gears } = this
    return nakedStats[key] + sumBy(gears.filter(isNonNullable), key) + this.getBonus(key)
  }

  get hp() {
    return this.nakedStats.hp
  }

  get firepower() {
    return this.getStat("firepower")
  }

  get torpedo() {
    return this.getStat("torpedo")
  }

  get antiAir() {
    return this.getStat("antiAir")
  }

  get armor() {
    return this.getStat("armor")
  }

  get los() {
    return this.getStat("los")
  }

  get asw() {
    return this.getStat("asw")
  }

  get evasion() {
    return this.getStat("evasion")
  }

  get luck() {
    return this.nakedStats.luck
  }

  get speed() {
    return this.getStat("speed")
  }

  get range() {
    const { nakedStats, gears, getBonus } = this
    const nakedRange = nakedStats.range
    const longest = maxBy(gears, "range")
    const range = longest && longest.range > nakedRange ? longest.range : nakedRange

    return range + getBonus("range")
  }
}
