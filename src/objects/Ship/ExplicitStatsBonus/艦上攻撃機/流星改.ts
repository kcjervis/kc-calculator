import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(52)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (["赤城改", "加賀改", "大鳳改"].includes(ship.name)) {
    bonus.add({ multiplier, firepower: 1 })
  }
  if (ship.name === "赤城改二") {
    bonus.add({ multiplier, firepower: 1, evasion: 1 })
  }
  if (ship.name === "赤城改二戊") {
    bonus.add({ multiplier, firepower: 2, evasion: 1 })
  }

  return bonus
}

export default createBonus
