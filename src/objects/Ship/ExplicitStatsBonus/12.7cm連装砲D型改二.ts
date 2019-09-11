import StatsBonus, { StatsBonusCreator } from "./StatsBonus"
import { shipNameIsKai2 } from "../../../utils"

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲D型改二
  const count267 = ship.countGear(267)
  if (count267 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isKagerouClass = className === "陽炎型"
  const isYuugumoClass = className === "夕雲型"
  const isShimakazeClass = className === "島風型"

  const isKai2 = shipNameIsKai2(shipName)

  // 単体ボーナス
  if (isYuugumoClass && isKai2) {
    bonus.add({
      multiplier: count267,
      firepower: 3,
      evasion: 1
    })
  } else if (isYuugumoClass || isShimakazeClass) {
    bonus.add({
      multiplier: count267,
      firepower: 2,
      evasion: 1
    })
  } else if (isKagerouClass && isKai2) {
    if (count267 === 1) {
      bonus.add({
        firepower: 2,
        evasion: 1
      })
    } else if (count267 === 2) {
      bonus.add({
        firepower: 3,
        evasion: 2
      })
    } else if (count267 === 3) {
      bonus.add({
        firepower: 4,
        evasion: 3
      })
    }
  } else if (isKagerouClass) {
    bonus.add({
      multiplier: count267,
      firepower: 1,
      evasion: 1
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasGear(gear => gear.is("SurfaceRadar"))) {
    if (isYuugumoClass && isKai2) {
      bonus.add({
        firepower: 3,
        torpedo: 4,
        evasion: 3
      })
    } else if (isYuugumoClass) {
      bonus.add({
        firepower: 2,
        torpedo: 3,
        evasion: 1
      })
    } else if (shipName === "島風改") {
      bonus.add({
        firepower: 1,
        torpedo: 3,
        evasion: 2
      })
    }
  }

  return bonus
}

export default createBonus
