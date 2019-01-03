import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 九七式艦攻(九三一空) 九七式艦攻(九三一空／熟練)
  const count = ship.countEquipment(82) + ship.countEquipment(302)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  if (ship.shipClass.is('TaiyouClass')) {
    bonus.add({
      multiplier: count,
      asw: 1,
      evasion: 1
    })
  }

  return bonus
}

export default createBonus
