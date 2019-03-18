import StatsBonus, { StatsBonusCreator } from './StatsBonus'
import { shipNameIsKai2 } from '../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const isKai2 = shipNameIsKai2(ship.name)
  const isIseClassKai2 = ship.shipClass.is('IseClass') && isKai2
  if (!isIseClassKai2) {
    return undefined
  }

  const egusaCount = ship.countEquipment(100)
  const model22634AirGroup = ship.countEquipment(291)
  const model22634AirGroupSkilled = ship.countEquipment(292)
  const otherSuiseiCount = ship.countEquipment(24) + ship.countEquipment(57) + ship.countEquipment(111)
  const bonus = new StatsBonus()

  if (egusaCount) {
    bonus.add({
      multiplier: egusaCount,
      firepower: 4
    })
  }

  if (model22634AirGroup) {
    bonus.add({
      multiplier: model22634AirGroup,
      firepower: 6,
      evasion: 1
    })
  }

  if (model22634AirGroupSkilled) {
    bonus.add({
      multiplier: model22634AirGroupSkilled,
      firepower: 8,
      evasion: 2
    })
  }

  if (otherSuiseiCount) {
    bonus.add({
      multiplier: otherSuiseiCount,
      firepower: 2
    })
  }

  return bonus
}

export default createBonus
