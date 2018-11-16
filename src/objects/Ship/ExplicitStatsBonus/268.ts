import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 北方迷彩(＋北方装備)
  const count = ship.countEquipment(268)
  if (count === 0) {
    return undefined
  }

  const isTamaKai2 = ship.masterId === 547
  const isKisoKai2 = ship.masterId === 146

  if (!isTamaKai2 && !isKisoKai2) {
    return undefined
  }
  // 累積しない
  return new StatsBonus({
    armor: 2,
    evasion: 7
  })
}

export default createBonus
