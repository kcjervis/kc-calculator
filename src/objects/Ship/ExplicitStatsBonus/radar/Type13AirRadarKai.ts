import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

/** 13号対空電探改 */
const bonusCreator: StatsBonusCreator = ship => {
  const count = ship.countEquipment(106)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (['潮', '時雨', '初霜', '榛名改二', '長門改二'].some(name => ship.name.includes(name))) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 2,
      evasion: 3,
      armor: 1
    })
  } else if (['矢矧', '霞', '雪風', '磯風', '磯風', '浜風', '朝霜', '涼月'].some(name => ship.name.includes(name))) {
    bonus.add({
      multiplier: count,
      antiAir: 2,
      evasion: 2,
      armor: 1
    })
  } else if (['大淀', '響', '鹿島'].some(name => ship.name.includes(name))) {
    bonus.add({
      multiplier: count,
      antiAir: 1,
      evasion: 3,
      armor: 1
    })
  }

  return bonus
}

export default bonusCreator
