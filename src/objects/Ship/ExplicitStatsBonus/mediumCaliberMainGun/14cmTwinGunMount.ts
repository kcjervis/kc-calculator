import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 14cm連装砲
  const count = ship.countEquipment(119)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.either('KatoriClass', 'YuubariClass')) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  if (shipClass.is('NisshinClass')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      torpedo: 1
    })
  }

  return bonus
}

export default bonusCreator