import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Re.2001 CB改
  const multiplier = ship.countGear(316)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.shipClass.is('AquilaClass')) {
    bonus.add({ multiplier, firepower: 4, antiAir: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
