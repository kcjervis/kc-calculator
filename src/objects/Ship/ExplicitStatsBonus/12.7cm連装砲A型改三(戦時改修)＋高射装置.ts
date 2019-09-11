import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲A型改三(戦時改修)＋高射装置
  const count295 = ship.countGear(295)
  if (count295 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.shipClass.isSpecialTypeDD) {
    // 単体ボーナス
    bonus.add({
      multiplier: count295,
      firepower: 2,
      antiAir: 2
    })

    // 相互シナジーボーナス
    // 水上電探
    if (ship.hasGear(gear => gear.is("SurfaceRadar"))) {
      bonus.add({
        firepower: 3,
        torpedo: 1,
        evasion: 2
      })
    }

    // 対空電探
    if (ship.hasGear(gear => gear.is("AirRadar"))) {
      bonus.add({
        antiAir: 6
      })
    }

    // 61cm三連装(酸素)魚雷後期型
    const tripleTorpedoLateModelCount = ship.countGear(285)
    // 61cm三連装魚雷系の数
    const tripleTorpedoCount = ship.countGear(13) + ship.countGear(125) + tripleTorpedoLateModelCount

    if (tripleTorpedoCount >= 1) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    }
    if (tripleTorpedoCount >= 2) {
      bonus.add({
        firepower: 1,
        torpedo: 2
      })
    }

    if (tripleTorpedoLateModelCount >= 1) {
      bonus.add({
        torpedo: 1
      })
    }
  }

  return bonus
}

export default createBonus
