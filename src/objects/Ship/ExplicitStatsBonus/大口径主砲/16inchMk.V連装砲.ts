import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(331)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === "Colorado改") {
    bonus.add({ multiplier, firepower: 2, evasion: 1 })
  }
  if (/^(Nelson改|長門改二|陸奥改二)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 2 })
  }
  if (/^(長門改?|陸奥改?|Colorado)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 1 })
  }

  return bonus
}

export default createBonus
