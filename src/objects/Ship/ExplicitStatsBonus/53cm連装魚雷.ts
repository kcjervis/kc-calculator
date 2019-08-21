import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 53cm連装魚雷
  const count = ship.countGear(174)
  if (count === 0) {
    return undefined
  }

  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.is('KamikazeClass')) {
    bonus.add({ multiplier: count, torpedo: 1, evasion: 2 })
  }
  if (shipClass.is('KongouClass')) {
    bonus.add({ multiplier: count, torpedo: 6, evasion: 3 })
  }

  return bonus
}

export default createBonus
