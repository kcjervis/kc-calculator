import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2, shipNameIsKai } from '../../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countEquipment(328)
  if (multiplier === 0) {
    return undefined
  }
  const { shipClass } = ship
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (shipClass.is('KongouClass')) {
    if (shipNameIsKai2(ship.name)) {
      bonus.add({ multiplier, firepower: 3, antiAir: 1, evasion: 1 })
    } else if (shipNameIsKai(ship.name)) {
      bonus.add({ multiplier, firepower: 2, evasion: 1 })
    } else {
      bonus.add({ multiplier, firepower: 1 })
    }
  }

  if (shipClass.either('FusouClass', 'IseClass')) {
    bonus.add({ multiplier, firepower: 1 })
  }

  return bonus
}

export default createBonus
