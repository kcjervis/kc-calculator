import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const count = ship.countEquipment(320)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  if (/^(蒼龍改二|飛龍改二)$/.test(ship.name)) {
    bonus.add({ firepower: 3 })
  }
  if (/^(鈴谷航改二|熊野航改二|日向改二)$/.test(ship.name)) {
    bonus.add({ firepower: 4 })
  }
  if (ship.name === '伊勢改二') {
    bonus.add({ firepower: 2 })
  }
  return bonus
}

export default createBonus
