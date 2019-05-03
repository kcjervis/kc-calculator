import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import { shipNameIsKai2, shipNameIsKai } from '../../../../utils'

const createBonus: StatsBonusCreator = ship => {
  // 41cm三連装砲改二
  const multiplier = ship.countEquipment(290)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship
  const isKai2 = shipNameIsKai2(ship.name)

  // 単体ボーナス
  if (shipClass.is('FusouClass') && isKai2) {
    bonus.add({ multiplier, firepower: 1 })
  }
  if (shipClass.is('IseClass') && shipNameIsKai(ship.name)) {
    bonus.add({ multiplier, firepower: 2, antiAir: 2, evasion: 1 })
  }
  if (ship.name === '伊勢改二') {
    bonus.add({ multiplier, firepower: 3, antiAir: 2, evasion: 1 })
  }
  if (ship.name === '日向改二') {
    bonus.add({ multiplier, firepower: 3, antiAir: 2, evasion: 2 })
  }

  // 相互シナジーボーナス
  // 対空電探
  if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
    if (shipClass.is('IseClass') && isKai2) {
      bonus.add({ antiAir: 2, evasion: 3 })
    }
  }

  return bonus
}

export default createBonus
