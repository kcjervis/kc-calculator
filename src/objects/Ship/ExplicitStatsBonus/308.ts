import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 5inch単装砲 Mk.30改＋GFCS Mk.37
  const count = ship.countEquipment(308)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isSamuel = [561, 681].includes(ship.masterId)

  // 単体ボーナス
  if (isSamuel) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 1
    })
  } else if (ship.shipType.isDestroyer) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
