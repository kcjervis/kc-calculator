import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(144)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.name.startsWith("赤城改")) {
    bonus.add({ firepower: 3 })
  }
  if (/^翔鶴改二甲?/.test(ship.name)) {
    bonus.add({ firepower: 4 })
  }
  if (/^(瑞鶴改二甲?|翔鶴改?|加賀改)$/.test(ship.name)) {
    bonus.add({ firepower: 2 })
  }
  if (/^(瑞鶴改?|龍驤改二)$/.test(ship.name)) {
    bonus.add({ firepower: 1 })
  }

  return bonus
}

export default createBonus
