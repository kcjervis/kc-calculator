import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲B型改二
  const count = ship.countEquipment(63)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isAyanamiClass = className === '綾波型'
  const isAkatsukiClass = className === '暁型'
  const isHatsuharuClass = className === '初春型'

  // 単体ボーナス
  if (isAyanamiClass || isAkatsukiClass || isHatsuharuClass) {
    bonus.add({
      multiplier: count,
      antiAir: 1
    })
  } else if (['白露改', '白露改二', '村雨改二'].includes(shipName)) {
    bonus.add({
      multiplier: count,
      evasion: 1
    })
  } else if (shipName === '時雨改二') {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  } else if (shipName === '夕立改二') {
    bonus.add({
      multiplier: count,
      firepower: 1,
      torpedo: 1,
      antiAir: 1,
      evasion: 2
    })
  } else if (shipName === '江風改二') {
    bonus.add({
      multiplier: count,
      evasion: 2
    })
  }

  return bonus
}

export default createBonus
