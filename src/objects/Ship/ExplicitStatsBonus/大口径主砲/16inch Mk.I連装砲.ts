import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countEquipment(330)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  // 単体ボーナス
  if (/^(Nelson改|長門改二|陸奥改二)$/.test(ship.name)) {
    bonus.add({ multiplier, firepower: 2 })
  }
  if (/^(長門改?|陸奥改?)$/.test(ship.name) || ship.shipClass.is('ColoradoClass')) {
    bonus.add({ multiplier, firepower: 1 })
  }

  return bonus
}

export default createBonus
