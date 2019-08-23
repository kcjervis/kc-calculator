import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(338)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (["赤城改", "加賀改"].includes(ship.name)) {
    bonus.add({ firepower: 1, antiAir: 1, evasion: 2 })
  }
  if ("赤城改二" === ship.name) {
    bonus.add({ firepower: 1, antiAir: 2, evasion: 3 })
  }
  if ("赤城改二戊" === ship.name) {
    bonus.add({ firepower: 4, antiAir: 3, evasion: 4 })
  }

  return bonus
}

export default createBonus
