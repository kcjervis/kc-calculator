import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(100)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name === "飛龍改二") {
    bonus.add({ firepower: 3 })
  }
  if (ship.name === "蒼龍改二") {
    bonus.add({ firepower: 6 })
  }
  if (ship.name === "伊勢改二") {
    bonus.add({ firepower: 4 })
  }
  return bonus
}

export default createBonus
