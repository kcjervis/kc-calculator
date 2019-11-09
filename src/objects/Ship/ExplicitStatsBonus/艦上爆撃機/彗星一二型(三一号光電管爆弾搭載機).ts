import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(320)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  if (/^(蒼龍改二|飛龍改二)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 3 })
  }
  if (/^(鈴谷航改二|熊野航改二|日向改二)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 4 })
  }
  if (ship.name === "伊勢改二") {
    bonus.add({ multiplier, firepower: 2 })
  }
  return bonus
}

export default createBonus
