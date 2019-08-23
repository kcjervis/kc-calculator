import MasterShipId from "../../../data/MasterShipId"
import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 35.6cm連装砲(ダズル迷彩)
  const count = ship.countGear(104)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const shipId = ship.masterId

  // 単体ボーナス
  if (shipId === MasterShipId.HarunaKai2) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 2
    })
  } else if (shipId === MasterShipId.KongouKai2) {
    bonus.add({
      multiplier: count,
      firepower: 2
    })
  } else if (shipId === MasterShipId.HieiKai2 || shipId === MasterShipId.KirishimaKai2) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
