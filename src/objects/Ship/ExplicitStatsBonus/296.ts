import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲B型改四(戦時改修)＋高射装置
  const count296 = ship.countEquipment(296)
  if (count296 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.either('AyanamiClass', 'AkatsukiClass')) {
    bonus.add({
      multiplier: count296,
      firepower: 1
    })
  } else if (shipClass.is('HatsuharuClass')) {
    bonus.add({
      multiplier: count296,
      firepower: 1,
      evasion: 1
    })
  } else if (shipName === '白露改二') {
    bonus.add({
      multiplier: count296,
      firepower: 2,
      evasion: 2
    })
  } else if (shipName === '時雨改二') {
    bonus.add({
      multiplier: count296,
      firepower: 2,
      antiAir: 1,
      evasion: 1
    })
  } else if (shipName === '村雨改二') {
    bonus.add({
      multiplier: count296,
      firepower: 1,
      antiAir: 1,
      evasion: 2
    })
  } else if (shipName === '夕立改二') {
    bonus.add({
      multiplier: count296,
      firepower: 2,
      antiAir: 1,
      evasion: 1
    })
  } else if (shipName === '江風改二') {
    bonus.add({
      multiplier: count296,
      firepower: 2,
      evasion: 2
    })
  } else if (shipClass.is('ShiratsuyuClass')) {
    bonus.add({
      multiplier: count296,
      firepower: 1
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
    if (shipClass.either('AyanamiClass', 'AkatsukiClass', 'HatsuharuClass')) {
      bonus.add({
        firepower: 1,
        torpedo: 2,
        evasion: 2
      })
    } else if (shipClass.is('ShiratsuyuClass')) {
      bonus.add({
        firepower: 1,
        torpedo: 3,
        evasion: 2
      })
    }
  }
  // 対空電探
  if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
    if (shipClass.either('AyanamiClass', 'AkatsukiClass', 'HatsuharuClass')) {
      bonus.add({
        antiAir: 5
      })
    } else if (shipClass.is('ShiratsuyuClass')) {
      bonus.add({
        antiAir: 6
      })
    }
  }

  // 61cm三連装(酸素)魚雷後期型
  if (ship.hasEquipment(285)) {
    if (shipClass.either('AyanamiClass', 'AkatsukiClass', 'HatsuharuClass')) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    }
  }
  // 61cm四連装(酸素)魚雷後期型
  if (ship.hasEquipment(286)) {
    if (shipClass.is('ShiratsuyuClass')) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    }
  }

  return bonus
}

export default createBonus
