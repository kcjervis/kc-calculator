import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 試製61cm六連装(酸素)魚雷
  const count = ship.countGear(179)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.shipClass.is("AkizukiClass")) {
    bonus.add({
      multiplier: count,
      torpedo: 1
    })
  }

  return bonus
}

export default createBonus
