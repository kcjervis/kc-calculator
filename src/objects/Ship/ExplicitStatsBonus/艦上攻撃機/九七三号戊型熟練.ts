import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(345)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name === "赤城改二戊") {
    bonus.add({ multiplier, firepower: 3, evasion: 1 })
  }
  if ("龍鳳改" === ship.name) {
    bonus.add({ multiplier, firepower: 5, evasion: 2, asw: 1 })
  }
  if (/^瑞鳳改二乙?$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 3, evasion: 3, asw: 2 })
  }
  if ("祥鳳改" === ship.name) {
    bonus.add({ multiplier, firepower: 3, evasion: 1, asw: 1 })
  }

  return bonus
}

export default createBonus
