import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // S9 Osprey
  const count = ship.countEquipment(304)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship
  const isKai2 = ship.name.includes('改二')

  if (
    shipClass.equal('KumaClass') ||
    shipClass.equal('NagaraClass') ||
    shipClass.equal('SendaiClass') ||
    shipClass.equal('AganoClass')
  ) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      evasion: 1,
      asw: 1
    })
  } else if (shipClass.equal('GotlandClass')) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      evasion: 2,
      asw: 2
    })
  }

  return bonus
}

export default createBonus
