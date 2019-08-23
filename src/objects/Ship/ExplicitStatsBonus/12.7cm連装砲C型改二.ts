import StatsBonus, { StatsBonusCreator } from "./StatsBonus"
import { shipNameIsKai2 } from "../../../utils"

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲C型改二
  const count266 = ship.countGear(266)
  if (count266 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const { shipClass } = ship

  const isShiratsuyuClass = shipClass.is("ShiratsuyuClass")
  const isAsashioClass = shipClass.is("AsashioClass")
  const isKagerouClass = shipClass.is("KagerouClass")

  // 単体ボーナス
  if (isKagerouClass && shipNameIsKai2(shipName)) {
    if (count266 === 1) {
      bonus.add({
        firepower: 2
      })
    } else if (count266 === 2) {
      bonus.add({
        firepower: 5
      })
    } else if (count266 === 3) {
      bonus.add({
        firepower: 6
      })
    }
  } else if (shipName === "雪風改" || shipName === "磯風乙改" || shipName === "時雨改二") {
    bonus.add({
      multiplier: count266,
      firepower: 1,
      evasion: 1
    })
  } else if (isShiratsuyuClass || isAsashioClass || isKagerouClass) {
    bonus.add({
      multiplier: count266,
      firepower: 1
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasGear(gear => gear.isSurfaceRadar)) {
    if (isShiratsuyuClass || isAsashioClass) {
      bonus.add({
        firepower: 1,
        torpedo: 3,
        evasion: 1
      })
    } else if (isKagerouClass) {
      bonus.add({
        firepower: 2,
        torpedo: 3,
        evasion: 1
      })
    }
  }

  return bonus
}

export default createBonus
