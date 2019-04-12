import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2 } from '../../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countEquipment(319)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  if (ship.shipClass.is('IseClass') && shipNameIsKai2(ship.name)) {
    bonus.add({ multiplier, firepower: 7, antiAir: 3, evasion: 2 })
  }

  return bonus
}

export default createBonus
