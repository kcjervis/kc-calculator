import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2 } from '../../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(319)
  if (multiplier === 0) {
    return undefined
  }

  const isKai2 = shipNameIsKai2(ship.name)
  const isIseClassKai2 = ship.shipClass.is('IseClass') && isKai2
  if (!isIseClassKai2) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (isIseClassKai2) {
    bonus.add({ multiplier, firepower: 7, antiAir: 3, evasion: 2 })
  }

  return bonus
}

export default createBonus
