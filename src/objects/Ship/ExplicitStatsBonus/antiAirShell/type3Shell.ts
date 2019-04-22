import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 三式弾
  const count = ship.countEquipment(35)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === '金剛改二') {
    bonus.add({ firepower: 1, antiAir: 1 })
  } else if (ship.name === '比叡改二') {
    bonus.add({ antiAir: 1 })
  } else if (ship.name === '榛名改二') {
    bonus.add({ antiAir: 1, evasion: 1 })
  } else if (ship.name === '霧島改二') {
    bonus.add({ firepower: 1 })
  }
  return bonus
}

export default bonusCreator
