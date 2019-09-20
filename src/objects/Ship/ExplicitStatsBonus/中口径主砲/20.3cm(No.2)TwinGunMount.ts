import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { ShipId } from "@jervis/data"

const bonusCreator: StatsBonusCreator = ship => {
  // 20.3cm(2号)連装砲
  const count = ship.countGear(90)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass, name } = ship
  const isAoba = name.includes("青葉")

  // 単体ボーナス
  if ([ShipId["古鷹改二"], ShipId["加古改二"], ShipId["衣笠改"]].includes(ship.masterId)) {
    bonus.add({ multiplier: count, firepower: 1 })
  }
  if (ShipId["青葉改"] === ship.masterId) {
    bonus.add({ multiplier: count, firepower: 1, antiAir: 1 })
  }
  if (ShipId["衣笠改二"] === ship.masterId) {
    bonus.add({ multiplier: count, firepower: 2, evasion: 1 })
  }

  // 相互シナジーボーナス
  if (ship.hasGear(gear => gear.is("SurfaceRadar"))) {
    if (shipClass.is("FurutakaClass") || shipClass.is("AobaClass")) {
      bonus.add({ firepower: 3, torpedo: 2, evasion: 2 })
    }
  }

  if (ship.hasGear(gear => gear.is("AirRadar"))) {
    if (isAoba) {
      bonus.add({ antiAir: 5, evasion: 2 })
    }
  }

  return bonus
}

export default bonusCreator
