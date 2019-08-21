import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲A型
  const count = ship.countGear(297)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const className = ship.shipClass.name

  const isFubukiClass = className === '吹雪型'
  const isAyanamiClass = className === '綾波型'
  const isAkatsukiClass = className === '暁型'

  // 単体ボーナス
  if (isFubukiClass) {
    bonus.add({
      multiplier: count,
      evasion: 2
    })
  } else if (isAyanamiClass || isAkatsukiClass) {
    bonus.add({
      multiplier: count,
      evasion: 1
    })
  }

  return bonus
}

export default createBonus
