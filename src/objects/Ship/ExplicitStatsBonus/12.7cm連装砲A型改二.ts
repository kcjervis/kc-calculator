import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲A型改二
  const count294 = ship.countGear(294)
  if (count294 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.shipClass.isSpecialTypeDD) {
    // 単体ボーナス
    bonus.add({
      multiplier: count294,
      firepower: 1
    })

    // 相互シナジーボーナス
    // 水上電探シナジー
    if (ship.hasGear(gear => gear.isSurfaceRadar)) {
      bonus.add({
        firepower: 3,
        torpedo: 1,
        evasion: 2
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
