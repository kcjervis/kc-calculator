import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲B型改四(戦時改修)＋高射装置
  const count296 = ship.countEquipment(296)
  if (count296 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isAyanamiClass = className === '綾波型'
  const isAkatsukiClass = className === '暁型'
  const isHatsuharuClass = className === '初春型'
  const isShiratsuyuClass = className === '白露型'

  // 単体ボーナス
  if (isAyanamiClass || isAkatsukiClass) {
    bonus.add({
      multiplier: count296,
      firepower: 1
    })
  } else if (isHatsuharuClass) {
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
  } else if (isShiratsuyuClass) {
    bonus.add({
      multiplier: count296,
      firepower: 1
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
    if (isAyanamiClass || isAkatsukiClass || isHatsuharuClass) {
      bonus.add({
        firepower: 1,
        torpedo: 2,
        evasion: 2
      })
    } else if (isShiratsuyuClass) {
      bonus.add({
        firepower: 1,
        torpedo: 3,
        evasion: 2
      })
    }
  }
  // 対空電探
  if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
    if (isAyanamiClass || isAkatsukiClass || isHatsuharuClass) {
      bonus.add({
        antiAir: 5
      })
    } else if (isShiratsuyuClass) {
      bonus.add({
        antiAir: 6
      })
    }
  }

  // 61cm三連装(酸素)魚雷後期型
  if (ship.hasEquipment(285)) {
    if (isAyanamiClass || isAkatsukiClass || isHatsuharuClass) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    }
  }
  // 61cm四連装(酸素)魚雷後期型
  if (ship.hasEquipment(285)) {
    if (isShiratsuyuClass) {
      bonus.add({
        firepower: 1,
        torpedo: 3
      })
    }
  }

  return bonus
}

export default createBonus
