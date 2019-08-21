import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(342)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (['赤城改', '加賀改', '大鳳改'].includes(ship.name) || /^(瑞鶴改二|翔鶴改二)甲?$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 1 })
  }
  if (ship.name === '赤城改二') {
    bonus.add({ multiplier, firepower: 2, antiAir: 1, evasion: 1 })
  }
  if (ship.name === '赤城改二戊') {
    bonus.add({ multiplier, firepower: 3, antiAir: 2, evasion: 2 })
  }

  return bonus
}

export default createBonus
