import StatsBonus, { StatsBonusCreator } from './StatsBonus'
import { shipNameIsKai2 } from '../../../utils'

const createBonus: StatsBonusCreator = ship => {
  // 16inch Mk.I三連装砲 AFCT改 FCR type284
  const count = ship.countGear(298) + ship.countGear(299) + ship.countGear(300)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.is('NelsonClass')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      armor: 1
    })
  } else if (shipClass.is('QueenElizabethClass')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      armor: 1,
      evasion: -2
    })
  } else if (shipClass.is('KongouClass') && shipNameIsKai2(ship.name)) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      armor: 1,
      evasion: -3
    })
  }

  return bonus
}

export default createBonus
