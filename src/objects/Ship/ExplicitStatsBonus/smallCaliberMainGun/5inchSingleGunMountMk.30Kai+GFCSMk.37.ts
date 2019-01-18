import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 5inch単装砲 Mk.30改＋GFCS Mk.37
  const count = ship.countEquipment(308)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass, shipType } = ship
  // 単体ボーナス
  if (!shipType.is('Destroyer')) {
    return undefined
  }
  if (shipClass.isUsNavy) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 1
    })
  } else {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
