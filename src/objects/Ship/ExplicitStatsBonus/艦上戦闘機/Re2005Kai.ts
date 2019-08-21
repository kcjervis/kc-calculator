import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Re.2005 改
  const multiplier = ship.countGear(189)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.shipClass.either('AquilaClass', 'GrafZeppelinClass')) {
    bonus.add({ multiplier, antiAir: 1, evasion: 2 })
  }

  return bonus
}

export default createBonus
