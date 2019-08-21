import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

/** 533mm 三連装魚雷 */
const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(283)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isTashkent = ship.name.includes('Ташкент')
  const isVerniy = ship.name.includes('Верный')

  // 単体ボーナス
  if (isTashkent || isVerniy) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      torpedo: 3,
      armor: 1
    })
  }

  return bonus
}

export default createBonus
