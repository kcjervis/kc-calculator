import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { shipNameIsKai2, shipNameIsKai } from "../../../../utils"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(328)
  if (multiplier === 0) {
    return undefined
  }
  const { shipClass } = ship
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (shipClass.is("KongouClass")) {
    if (ship.name === "金剛改二丙") {
      bonus.add({ multiplier, firepower: 3, torpedo: 1, evasion: 1 })
    } else if (shipNameIsKai2(ship.name) || shipNameIsKai(ship.name)) {
      bonus.add({ multiplier, firepower: 2, evasion: 1 })
    } else {
      bonus.add({ multiplier, firepower: 1 })
    }
  }

  if (shipClass.any("FusouClass", "IseClass")) {
    bonus.add({ multiplier, firepower: 1 })
  }

  return bonus
}

export default createBonus
