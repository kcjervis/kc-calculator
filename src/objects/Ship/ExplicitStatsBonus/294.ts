import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲A型改二
  const count294 = ship.countEquipment(294)
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
    if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
      bonus.add({
        firepower: 3,
        torpedo: 1,
        evasion: 2
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
        firepower: 1,
        torpedo: 2
      })
    }
  }
  return bonus
}

export default createBonus
