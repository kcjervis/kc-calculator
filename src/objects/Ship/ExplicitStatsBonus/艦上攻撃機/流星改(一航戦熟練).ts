import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(343)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (/^(瑞鶴改二|翔鶴改二)甲?$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 1 })
  }
  if (["赤城改", "加賀改"].includes(ship.name)) {
    bonus.add({ multiplier, firepower: 2 })
  }
  if (ship.name === "赤城改二") {
    bonus.add({ multiplier, firepower: 3, antiAir: 2, evasion: 1 })
  }
  if (ship.name === "赤城改二戊") {
    bonus.add({ multiplier, firepower: 5, antiAir: 3, evasion: 3 })
  }

  return bonus
}

export default createBonus
