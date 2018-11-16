import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 53cm艦首(酸素)魚雷
  const count = ship.countEquipment(67)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (!ship.shipType.isSubmarine) {
    bonus.add({
      multiplier: count,
      torpedo: -5
    })
  }

  return bonus
}

export default createBonus
