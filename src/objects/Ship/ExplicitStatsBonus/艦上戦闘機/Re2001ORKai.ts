import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // Re.2001 OR改
  const multiplier = ship.countGear(184)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.shipClass.is("AquilaClass")) {
    bonus.add({ multiplier, firepower: 1, antiAir: 2, evasion: 3 })
  }

  return bonus
}

export default createBonus
