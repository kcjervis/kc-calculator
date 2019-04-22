import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2 } from '../../../../utils'

const bonusCreator: StatsBonusCreator = ship => {
  // 三式弾
  const count = ship.countEquipment(317)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === '金剛改二') {
    bonus.add({ firepower: 3, antiAir: 3 })
  } else if (ship.name === '比叡改二') {
    bonus.add({ firepower: 2, antiAir: 2 })
  } else if (ship.name === '榛名改二' || ship.name === '陸奥改二') {
    bonus.add({ firepower: 2, antiAir: 2, evasion: 1 })
  } else if (ship.name === '霧島改二') {
    bonus.add({ firepower: 3, antiAir: 2 })
  } else if (ship.name === '長門改二') {
    bonus.add({ firepower: 1, antiAir: 2 })
  } else if (ship.shipClass.is('KongouClass')) {
    bonus.add({ firepower: 1, antiAir: 1 })
  }

  return bonus
}

export default bonusCreator
