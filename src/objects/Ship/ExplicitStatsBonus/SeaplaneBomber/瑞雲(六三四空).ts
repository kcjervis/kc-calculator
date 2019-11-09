import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { shipNameIsKai2, shipNameIsKai } from "../../../../utils"

const createBonus: StatsBonusCreator = ship => {
  // 瑞雲(六三四空) 瑞雲12型(六三四空)
  const count = ship.countGear(79) + ship.countGear(81)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isKai = shipNameIsKai(ship.name)
  const isKai2 = shipNameIsKai2(ship.name)
  const { shipClass } = ship

  const isIseClass = shipClass.is("IseClass")

  if (isIseClass && isKai2) {
    bonus.add({ multiplier: count, firepower: 3 })
  } else if (ship.shipType.is("AviationBattleship") && shipClass.any("FusouClass", "IseClass")) {
    bonus.add({ multiplier: count, firepower: 2 })
  }

  return bonus
}

export default createBonus
