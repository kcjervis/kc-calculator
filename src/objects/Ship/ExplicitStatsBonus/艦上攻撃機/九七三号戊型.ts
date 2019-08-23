import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(344)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name === "赤城改二戊") {
    bonus.add({ multiplier, firepower: 3 })
  }
  if ("龍鳳改" === ship.name) {
    bonus.add({ multiplier, firepower: 4, asw: 1 })
  }
  if (/^瑞鳳改二乙?$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 2, asw: 2 })
  }
  if ("祥鳳改" === ship.name) {
    bonus.add({ multiplier, firepower: 2, asw: 1 })
  }

  return bonus
}

export default createBonus
