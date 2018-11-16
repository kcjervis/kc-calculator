import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 12.7cm連装砲C型改二
  const count266 = ship.countEquipment(266)
  if (count266 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isShiratsuyuClass = className === '白露型'
  const isAsashioClass = className === '朝潮型'
  const isKagerouClass = className === '陽炎型'

  // 単体ボーナス
  if (shipName === '時雨改二') {
    bonus.add({
      multiplier: count266,
      firepower: 1,
      evasion: 1
    })
  } else if (isShiratsuyuClass || isAsashioClass) {
    bonus.add({
      multiplier: count266,
      firepower: 1
    })
  } else if (isKagerouClass && shipName.includes('改二')) {
    if (count266 === 1) {
      bonus.add({
        firepower: 2
      })
    } else if (count266 === 2) {
      bonus.add({
        firepower: 5
      })
    } else if (count266 === 3) {
      bonus.add({
        firepower: 6
      })
    } else if (shipName === '雪風改' || shipName === '磯風乙改') {
      bonus.add({
        multiplier: count266,
        firepower: 1,
        evasion: 1
      })
    } else if (isKagerouClass) {
      bonus.add({
        multiplier: count266,
        firepower: 1
      })
    }
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
    if (isShiratsuyuClass || isAsashioClass) {
      bonus.add({
        firepower: 1,
        torpedo: 3,
        evasion: 1
      })
    } else if (isShiratsuyuClass) {
      bonus.add({
        firepower: 2,
        torpedo: 3,
        evasion: 1
      })
    }
  }

  return bonus
}

export default createBonus
