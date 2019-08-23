import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(143)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name.startsWith("赤城改")) {
    bonus.add({ firepower: 3 })
  }
  if (ship.name === "加賀改" || ship.name.startsWith("翔鶴")) {
    bonus.add({ firepower: 2 })
  }
  if (ship.name.startsWith("瑞鶴") || ship.name === "龍驤改二") {
    bonus.add({ firepower: 1 })
  }

  return bonus
}

export default createBonus
