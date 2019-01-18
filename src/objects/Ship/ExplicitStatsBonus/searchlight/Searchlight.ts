import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 探照灯
  const count = ship.countEquipment(74)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { name } = ship
  const isHiei = name.includes('比叡')
  const isKirishima = name.includes('霧島')
  const isChoukai = name.includes('鳥海')
  const isJintsuu = name.includes('神通')
  const isAkatsuki = name.includes('暁')
  const isAkigumo = name.includes('秋雲')
  const isYukikaze = name.includes('雪風')

  // 単体ボーナス
  if (isJintsuu) {
    bonus.add({
      firepower: 2,
      torpedo: 2,
      evasion: -1
    })
  } else if (isHiei || isKirishima || isChoukai || isAkatsuki) {
    bonus.add({
      firepower: 2,
      evasion: -1
    })
  } else if (isAkigumo) {
    bonus.add({
      firepower: 1
    })
  } else if (isYukikaze) {
    bonus.add({
      antiAir: 1
    })
  }

  return bonus
}

export default bonusCreator
