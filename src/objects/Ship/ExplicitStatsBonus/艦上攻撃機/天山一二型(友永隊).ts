import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(94)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name === "飛龍改二") {
    bonus.add({ firepower: 7 })
  }
  if (ship.name === "蒼龍改二") {
    bonus.add({ firepower: 3 })
  }

  return bonus
}

export default createBonus
