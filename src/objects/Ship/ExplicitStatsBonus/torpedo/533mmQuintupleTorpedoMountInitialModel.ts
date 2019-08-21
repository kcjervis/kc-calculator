import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

/** 533mm五連装魚雷(初期型) */
const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(314)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass, shipType } = ship

  // 単体ボーナス
  if (shipClass.isUsNavy && shipType.is('Destroyer')) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      torpedo: 3
    })
  }

  return bonus
}

export default createBonus
