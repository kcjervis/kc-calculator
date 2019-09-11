import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(332)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === "Colorado改") {
    bonus.add({ multiplier, firepower: 2, evasion: 1, antiAir: 1 })
  } else if (/^(Nelson改|長門改二|陸奥改二)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 2 })
  } else if (ship.shipClass.any("NagatoClass", "ColoradoClass")) {
    bonus.add({ multiplier, firepower: 1 })
  }

  return bonus
}

export default createBonus
