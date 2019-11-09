import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { shipNameIsKai2 } from "../../../../utils"

const createBonus: StatsBonusCreator = ship => {
  // 瑞雲(六三四空/熟練)
  const count = ship.countGear(237)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isKai2 = shipNameIsKai2(ship.name)
  const { shipClass } = ship

  const isIseClass = shipClass.is("IseClass")

  if (isIseClass && isKai2) {
    bonus.add({ multiplier: count, firepower: 4, evasion: 2 })
  } else if (isIseClass && ship.shipType.is("AviationBattleship")) {
    bonus.add({ multiplier: count, firepower: 3, evasion: 1 })
  } else if (shipClass.is("FusouClass") && ship.shipType.is("AviationBattleship")) {
    bonus.add({ multiplier: count, firepower: 2 })
  }

  return bonus
}

export default createBonus
