import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // GFCS Mk.37
  const count = ship.countEquipment(307)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.isUsNavy) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 1,
      evasion: 1
    })
  }

  return bonus
}

export default bonusCreator
