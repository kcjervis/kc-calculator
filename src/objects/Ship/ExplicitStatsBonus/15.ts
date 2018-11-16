import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 61cm四連装(酸素)魚雷
  const count = ship.countEquipment(15)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass, name } = ship
  const isKai2 = name.includes('改二')

  // 単体ボーナス
  if (shipClass.equal('KagerouClass') && isKai2) {
    bonus.add({
      multiplier: count,
      torpedo: 2
    })
  }

  return bonus
}

export default createBonus
