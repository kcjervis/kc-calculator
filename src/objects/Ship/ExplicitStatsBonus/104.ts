import ShipMasterId from '../../../data/ShipMasterId'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 35.6cm連装砲(ダズル迷彩)
  const count = ship.countEquipment(104)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const shipId = ship.masterId

  // 単体ボーナス
  if (shipId === ShipMasterId.HarunaKai2) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 2
    })
  } else if (shipId === ShipMasterId.KongouKai2) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  } else if (shipId === ShipMasterId.HieiKai2 || shipId === ShipMasterId.KirishimaKai2) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
