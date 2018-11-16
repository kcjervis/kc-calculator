import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲A型改三(戦時改修)＋高射装置
  const count295 = ship.countEquipment(295)
  if (count295 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.shipClass.isSpecialTypeDD) {
    // 単体ボーナス
    bonus.add({
      multiplier: count295,
      firepower: 2,
      torpedo: 1,
      evasion: 2
    })

    // 相互シナジーボーナス
    // 水上電探
    if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
      bonus.add({
        firepower: 3,
        torpedo: 1,
        evasion: 2
      })
    }

    // 対空電探
    if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
      bonus.add({
        antiAir: 6
      })
    }

    // 61cm三連装(酸素)魚雷
    const count125 = ship.countEquipment(125)
    // 61cm三連装(酸素)魚雷後期型
    const count285 = ship.countEquipment(285)
    if (count125 >= 1) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    } else if (count285 >= 1) {
      bonus.add({
        firepower: 1,
        torpedo: 4
      })
    }

    if (count125 + count285 >= 2) {
      bonus.add({
        torpedo: 2
      })
    }
    if (count125 >= 1 && count285 >= 1) {
      bonus.add({
        firepower: 1
      })
    }
  }

  return bonus
}

export default createBonus
