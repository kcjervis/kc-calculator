import { isNonNullable, shipNameIsKai2 } from "../../../utils"
import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 61cm三連装(酸素)魚雷後期型
  const tripleTorpedoLateModels = ship.gears.filter(isNonNullable).filter(gear => gear.masterId === 285)
  const count = tripleTorpedoLateModels.length
  const improved10Count = tripleTorpedoLateModels.filter(torpedo => torpedo.improvement.value >= 10).length
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship
  const isKai2 = shipNameIsKai2(ship.name)

  const isSpecialTypeDestroyerKai2 = shipClass.isSpecialTypeDestroyer && isKai2
  const isHatsuharuClassKai2 = shipClass.is("HatsuharuClass") && isKai2

  // 単体ボーナス
  if (isSpecialTypeDestroyerKai2 || isHatsuharuClassKai2) {
    bonus.add({
      multiplier: Math.min(count, 2),
      torpedo: 2,
      evasion: 1
    })
    bonus.add({
      multiplier: Math.min(improved10Count, 2),
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
