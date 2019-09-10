import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 12cm単装砲改二
  const count293 = ship.countGear(293)
  if (count293 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const className = ship.shipClass.name

  const isShimushuClass = className === "占守型"
  const isEtorofuClass = className === "択捉型"
  const isKamikazeClass = className === "神風型"
  const isMutsukiClass = className === "睦月型"

  // 単体ボーナス
  if (isKamikazeClass || isMutsukiClass) {
    bonus.add({
      multiplier: count293,
      firepower: 2,
      antiAir: 1,
      evasion: 3
    })
  } else if (isShimushuClass || isEtorofuClass) {
    bonus.add({
      multiplier: count293,
      firepower: 1,
      antiAir: 1,
      evasion: 2
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasGear(gear => gear.hasAttr("SurfaceRadar"))) {
    if (isKamikazeClass || isMutsukiClass) {
      bonus.add({
        firepower: 2,
        torpedo: 1,
        evasion: 3
      })
    } else if (isShimushuClass || isEtorofuClass) {
      bonus.add({
        firepower: 2,
        evasion: 3,
        asw: 1
      })
    }
  }

  // 53cm連装魚雷
  const count174 = ship.countGear(174)
  if (count174 === 1) {
    bonus.add({
      firepower: 2,
      torpedo: 4
    })
  } else if (count174 === 2) {
    bonus.add({
      firepower: 3,
      torpedo: 7
    })
  }

  return bonus
}

export default createBonus
