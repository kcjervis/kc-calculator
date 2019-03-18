import { nonNullable, shipNameIsKai2 } from '../../../../utils'
import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 61cm四連装(酸素)魚雷後期型
  const qxygenTorpedoMountLateModels = ship.equipments.filter(nonNullable).filter(equip => equip.masterId === 286)
  const count = qxygenTorpedoMountLateModels.length
  const improved5Count = qxygenTorpedoMountLateModels.filter(torpedo => torpedo.improvement.value >= 5).length
  const improved10Count = qxygenTorpedoMountLateModels.filter(torpedo => torpedo.improvement.value >= 10).length
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship
  const isKai2 = shipNameIsKai2(ship.name)
  if (!isKai2) {
    return undefined
  }

  // 単体ボーナス
  if (shipClass.either('ShiratsuyuClass', 'AsashioClass', 'KagerouClass', 'YuugumoClass')) {
    bonus.add({
      multiplier: Math.min(count, 2),
      torpedo: 2,
      evasion: 1
    })
    bonus.add({
      multiplier: Math.min(improved10Count, 2),
      firepower: 1
    })

    if (shipClass.is('KagerouClass')) {
      bonus.add({
        multiplier: Math.min(improved5Count, 2),
        torpedo: 1
      })
    }
  }

  return bonus
}

export default createBonus
