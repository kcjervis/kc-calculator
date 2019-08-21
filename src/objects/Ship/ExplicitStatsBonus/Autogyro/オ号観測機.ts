import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // オ号観測機改 オ号観測機改二
  const multiplier = ship.countGear(324) + ship.countGear(325)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (ship.name === '伊勢改二') {
    bonus.add({ multiplier, antiAir: 1, evasion: 1 })
  }
  if (ship.name === '日向改二') {
    bonus.add({ multiplier, antiAir: 2, evasion: 1 })
  }

  return bonus
}

export default createBonus
