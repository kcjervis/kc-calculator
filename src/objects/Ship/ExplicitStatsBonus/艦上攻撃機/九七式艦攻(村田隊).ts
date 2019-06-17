import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countEquipment(143)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (/^赤城改/.test(ship.name)) {
    bonus.add({ firepower: 3 })
  }
  if (ship.name === '加賀改' || /^翔鶴/.test(ship.name)) {
    bonus.add({ firepower: 2 })
  }
  if (/^瑞鶴/.test(ship.name) || ship.name === '龍驤改二') {
    bonus.add({ firepower: 1 })
  }

  return bonus
}

export default createBonus
