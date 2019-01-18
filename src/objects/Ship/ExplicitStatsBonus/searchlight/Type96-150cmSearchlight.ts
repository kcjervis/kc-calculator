import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 96式150cm探照灯
  const count = ship.countEquipment(140)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { name } = ship
  const isHiei = name.includes('比叡')
  const isKirishima = name.includes('霧島')

  // 単体ボーナス
  if (isHiei || isKirishima) {
    bonus.add({
      firepower: 3,
      evasion: -2
    })
  }

  return bonus
}

export default bonusCreator
