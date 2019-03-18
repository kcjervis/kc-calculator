import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Re.2001 G改
  const multiplier = ship.countEquipment(188)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.shipClass.is('AquilaClass')) {
    bonus.add({ multiplier, firepower: 3, antiAir: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
