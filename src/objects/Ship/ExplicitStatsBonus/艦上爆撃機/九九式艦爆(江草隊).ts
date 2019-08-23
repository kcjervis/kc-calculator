import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(99)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name.startsWith("飛龍")) {
    bonus.add({ firepower: 1 })
  }
  if (ship.name.startsWith("蒼龍")) {
    bonus.add({ firepower: 4 })
  }

  return bonus
}

export default createBonus
