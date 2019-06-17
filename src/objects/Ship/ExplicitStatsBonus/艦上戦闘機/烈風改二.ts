import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countEquipment(336)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (['赤城改', '加賀改'].includes(ship.name)) {
    bonus.add({ firepower: 1, antiAir: 1, evasion: 1 })
  }
  if (['赤城改二', '赤城改二戊'].includes(ship.name)) {
    bonus.add({ firepower: 1, antiAir: 2, evasion: 1 })
  }

  return bonus
}

export default createBonus
