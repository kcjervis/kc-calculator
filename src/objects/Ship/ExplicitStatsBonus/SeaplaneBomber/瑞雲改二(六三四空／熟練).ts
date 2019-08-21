import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2 } from '../../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const count322 = ship.countGear(323)
  if (count322 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  if (shipClass.is('IseClass') && shipNameIsKai2(ship.name)) {
    bonus.add({
      multiplier: count322,
      firepower: 6,
      antiAir: 3,
      asw: 2,
      evasion: 3
    })
  }

  return bonus
}

export default createBonus
