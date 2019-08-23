import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(326)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === "伊勢改二") {
    bonus.add({ multiplier, firepower: 2, asw: 1, evasion: 2 })
  }
  if (ship.name === "日向改二") {
    bonus.add({ multiplier, firepower: 3, asw: 2, evasion: 3 })
  }

  return bonus
}

export default createBonus
