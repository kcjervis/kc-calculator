import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

// 北方迷彩(＋北方装備)
const createBonus268: StatsBonusCreator = ship => {
  if (!ship.hasEquipment(268)) {
    return undefined
  }
  if (!['多摩改', '多摩改二', '木曾改', '木曾改二'].includes(ship.name)) {
    return undefined
  }
  return new StatsBonus({
    evasion: 7,
    armor: 2
  })
}

export default [createBonus268]
