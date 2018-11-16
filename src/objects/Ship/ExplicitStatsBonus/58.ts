import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 61cm四連装(酸素)魚雷
  const count = ship.countEquipment(58)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass, shipType } = ship

  // 単体ボーナス
  if (shipType.equal('TorpedoCruiser') || shipClass.equal('ShimakazeClass') || shipClass.equal('AkizukiClass')) {
    bonus.add({
      multiplier: count,
      torpedo: 1
    })
  }

  return bonus
}

export default createBonus
