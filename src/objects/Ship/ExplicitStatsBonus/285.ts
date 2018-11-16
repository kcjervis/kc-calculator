import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 61cm三連装(酸素)魚雷後期型
  const count = ship.countEquipment(285)
  const countImproved10 = ship.countEquipment(equip => equip.improvement.value >= 10)
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
      multiplier: count,
      torpedo: 2,
      evasion: 1
    })
    if (countImproved10 > 0) {
      bonus.add({
        multiplier: countImproved10,
        firepower: 1
      })
    }
  }

  return bonus
}

export default createBonus
