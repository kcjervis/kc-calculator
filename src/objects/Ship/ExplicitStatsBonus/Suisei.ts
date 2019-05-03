import StatsBonus, { StatsBonusCreator } from './StatsBonus'
import { shipNameIsKai2 } from '../../../utils'

const createBonus: StatsBonusCreator = ship => {
  const isKai2 = shipNameIsKai2(ship.name)
  const isIseClassKai2 = ship.shipClass.is('IseClass') && isKai2
  if (!isIseClassKai2) {
    return undefined
  }

  const model22634AirGroup = ship.countEquipment(291)
  const model22634AirGroupSkilled = ship.countEquipment(292)
  const otherSuiseiCount = ship.countEquipment(24) + ship.countEquipment(57) + ship.countEquipment(111)
  // 三号爆弾搭載機
  const type3ClusterBombsCount = ship.countEquipment(319)
  const bonus = new StatsBonus()

  if (model22634AirGroup) {
    bonus.add({ multiplier: model22634AirGroup, firepower: 6, evasion: 1 })
  }

  if (model22634AirGroupSkilled) {
    bonus.add({ multiplier: model22634AirGroupSkilled, firepower: 8, evasion: 2 })
  }

  if (otherSuiseiCount) {
    bonus.add({ multiplier: otherSuiseiCount, firepower: 2 })
  }

  if (type3ClusterBombsCount) {
    bonus.add({ multiplier: type3ClusterBombsCount, firepower: 7, antiAir: 3, evasion: 2 })
  }

  return bonus
}

export default createBonus
