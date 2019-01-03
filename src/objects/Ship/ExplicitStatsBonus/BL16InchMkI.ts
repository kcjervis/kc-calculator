import MasterShipId from '../../../data/MasterShipId'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 16inch Mk.I三連装砲 AFCT改 FCR type284
  const count = ship.countEquipment(298) + ship.countEquipment(299) + ship.countEquipment(300)
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
  } else if (ship.masterId === MasterShipId.KongouKai2) {
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
