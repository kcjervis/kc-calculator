import { nonNullable } from '../../../utils'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 61cm三連装(酸素)魚雷後期型
  const tripleTorpedoLateModels = ship.equipments.filter(nonNullable).filter(equip => equip.masterId === 285)
  const count = tripleTorpedoLateModels.length
  const improved10Count = tripleTorpedoLateModels.filter(torpedo => torpedo.improvement.value >= 10).length
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name
  const className = ship.shipClass.name

  const isHatsuharuClass = className === '初春型'

  const isKai2 = shipName.includes('改二')

  const isSpecialTypeDDKai2 = ship.shipClass.isSpecialTypeDD && isKai2
  const isHatsuharuClassKai2 = isHatsuharuClass && isKai2

  // 単体ボーナス
  if (isSpecialTypeDDKai2 || isHatsuharuClassKai2) {
    bonus.add({
      multiplier: Math.min(count, 2),
      torpedo: 2,
      evasion: 1
    })
    bonus.add({
      multiplier: Math.min(improved10Count, 2),
      firepower: 1
    })
  }

  return bonus
}

export default createBonus
