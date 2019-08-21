import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

/** 130mm B-13連装砲 */
const bonusCreator: StatsBonusCreator = ship => {
  const count = ship.countGear(282)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isTashkent = ship.name.includes('Ташкент')
  const isVerniy = ship.name.includes('Верный')
  const isYuubari = ship.name.includes('夕張')

  // 単体ボーナス
  if (isTashkent || isVerniy || isYuubari) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      armor: 1
    })
  }
  return bonus
}

export default bonusCreator
