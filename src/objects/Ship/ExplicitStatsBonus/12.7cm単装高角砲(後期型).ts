import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 改修値7以上の12.7cm単装高角砲(後期型)
  const count229Improved7 = ship.countGear(gear => gear.masterId === 229 && gear.improvement.value >= 7)
  if (count229Improved7 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isKamikazeClass = className === '神風型'
  const isMutsukiClass = className === '睦月型'

  const isCoastalDefenseShip = ship.shipType.name === '海防艦'

  // 単体ボーナス
  if (isKamikazeClass || isMutsukiClass || isCoastalDefenseShip) {
    bonus.add({
      multiplier: count229Improved7,
      firepower: 1,
      antiAir: 1
    })
  } else if (shipName === '由良改二') {
    bonus.add({
      multiplier: count229Improved7,
      firepower: 2,
      antiAir: 3
    })
  } else if (shipName === '鬼怒改二') {
    bonus.add({
      multiplier: count229Improved7,
      firepower: 2,
      antiAir: 2
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasGear(gear => gear.isSurfaceRadar)) {
    if (isKamikazeClass || isMutsukiClass) {
      bonus.add({
        firepower: 2,
        evasion: 3
      })
    } else if (isCoastalDefenseShip) {
      bonus.add({
        firepower: 1,
        evasion: 4
      })
    } else if (shipName === '由良改二' || shipName === '鬼怒改二') {
      bonus.add({
        firepower: 3,
        evasion: 2
      })
    }
  }

  return bonus
}

export default createBonus
