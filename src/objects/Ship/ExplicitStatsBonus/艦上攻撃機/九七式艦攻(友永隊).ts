import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countGear(93)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (/^飛龍/.test(ship.name)) {
    bonus.add({ firepower: 3 })
  }
  if (/^蒼龍/.test(ship.name)) {
    bonus.add({ firepower: 1 })
  }

  return bonus
}

export default createBonus
