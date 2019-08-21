import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 三式水中探信儀
  const count = ship.countGear(47)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipNameIs = (name: string) =>
    ['', '改', '乙改', '改二', '改二乙', '改ニ丁'].map(grade => name + grade).includes(ship.name)

  // 単体ボーナス
  if (['神風', '春風', '時雨', '山風', '舞風', '朝霜'].some(shipNameIs)) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      evasion: 2,
      asw: 3
    })
  } else if (['潮', '雷', '山雲', '磯風', '浜風', '岸波'].some(shipNameIs)) {
    bonus.add({
      multiplier: count,
      evasion: 2,
      asw: 2
    })
  }

  return bonus
}

export default createBonus
