import StatsBonus, { StatsBonusCreator } from "./StatsBonus"
import { ShipId } from "@jervis/data"

const createBonus: StatsBonusCreator = ship => {
  // 35.6cm連装砲(ダズル迷彩)
  const count = ship.countGear(104)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const shipId = ship.masterId

  // 単体ボーナス
  if (shipId === ShipId["榛名改二"]) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 1,
      evasion: 2
    })
  } else if (shipId === ShipId["金剛改二"]) {
    bonus.add({
      multiplier: count,
      firepower: 2
    })
  } else if (shipId === ShipId["金剛改二丙"] || shipId === ShipId["霧島改二"]) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
