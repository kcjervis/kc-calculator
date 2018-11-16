import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 53cm連装魚雷
  const count = ship.countEquipment(174)
  if (count === 0) {
    return undefined
  }

  const className = ship.shipClass.name

  const isKamikazeClass = className === '神風型'

  // 単体ボーナス
  if (isKamikazeClass) {
    return new StatsBonus({
      multiplier: count,
      torpedo: 1,
      evasion: 2
    })
  }

  return undefined
}

export default createBonus
