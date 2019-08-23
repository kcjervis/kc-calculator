import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(93)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name.startsWith("飛龍")) {
    bonus.add({ firepower: 3 })
  }
  if (ship.name.startsWith("蒼龍")) {
    bonus.add({ firepower: 1 })
  }

  return bonus
}

export default createBonus
