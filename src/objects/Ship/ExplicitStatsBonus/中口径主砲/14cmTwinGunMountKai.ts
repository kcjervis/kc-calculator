import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 14cm連装砲改
  const count = ship.countGear(310)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.is('YuubariClass')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 1
    })
  }
  if (shipClass.is('KatoriClass')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      evasion: 1
    })
  }
  if (shipClass.is('NisshinClass')) {
    bonus.add({
      multiplier: count,
      firepower: 3,
      torpedo: 2,
      antiAir: 1,
      evasion: 1
    })
  }

  return bonus
}

export default bonusCreator
