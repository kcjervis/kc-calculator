import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 41cm三連装砲改二
  const count290 = ship.countEquipment(290)
  if (count290 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isFusouClass = className === '扶桑型'
  const isIseClass = className === '伊勢型'

  const isKai2 = shipName.includes('改二')

  // 単体ボーナス
  if (isFusouClass && isKai2) {
    bonus.add({
      multiplier: count290,
      firepower: 1
    })
  } else if (isIseClass) {
    if (isKai2) {
      bonus.add({
        multiplier: count290,
        firepower: 3,
        antiAir: 2,
        evasion: 1
      })
    } else {
      bonus.add({
        multiplier: count290,
        firepower: 2,
        antiAir: 2,
        evasion: 1
      })
    }
  }

  // 相互シナジーボーナス
  // 対空電探
  if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
    if (isIseClass && isKai2) {
      bonus.add({
        antiAir: 2,
        evasion: 3
      })
    }
  }

  return bonus
}

export default createBonus
