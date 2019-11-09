import StatsBonus, { StatsBonusCreator } from "./StatsBonus"
import { shipNameIsKai2 } from "../../../utils"

const createBonus: StatsBonusCreator = ship => {
  // 61cm四連装(酸素)魚雷
  const multiplier = Math.min(ship.countGear(15), 2)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass, name } = ship
  const isKai2 = shipNameIsKai2(name)

  // 単体ボーナス
  if (shipClass.is("KagerouClass") && isKai2) {
    bonus.add({ multiplier, torpedo: 2 })
  }

  return bonus
}

export default createBonus
