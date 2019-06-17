import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countEquipment(339)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (['赤城改', '加賀改'].includes(ship.name)) {
    bonus.add({ firepower: 1, antiAir: 2, evasion: 2 })
  }
  if ('赤城改二' === ship.name) {
    bonus.add({ firepower: 1, antiAir: 3, evasion: 4 })
  }
  if ('赤城改二戊' === ship.name) {
    bonus.add({ firepower: 6, antiAir: 4, evasion: 5 })
  }

  return bonus
}

export default createBonus
