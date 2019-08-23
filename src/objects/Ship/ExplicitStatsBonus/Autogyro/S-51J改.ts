import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(327)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === "伊勢改二") {
    bonus.add({ multiplier, firepower: 1, asw: 3, evasion: 1 })
  }
  if (ship.name === "日向改二") {
    bonus.add({ multiplier, firepower: 2, asw: 4, evasion: 2 })
  }

  return bonus
}

export default createBonus
