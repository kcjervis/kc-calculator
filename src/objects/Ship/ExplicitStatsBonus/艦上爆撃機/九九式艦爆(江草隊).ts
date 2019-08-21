import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(99)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (/^飛龍/.test(ship.name)) {
    bonus.add({ firepower: 1 })
  }
  if (/^蒼龍/.test(ship.name)) {
    bonus.add({ firepower: 4 })
  }

  return bonus
}

export default createBonus
