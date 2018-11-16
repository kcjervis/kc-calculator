import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Bofors15.2cm連装砲 Model1930
  const count = ship.countEquipment(303)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship
  const classId = ship.shipClass.id

  // 単体ボーナス
  if (
    shipClass.equal('KumaClass') ||
    shipClass.equal('NagaraClass') ||
    shipClass.equal('SendaiClass') ||
    shipClass.equal('AganoClass')
  ) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 1
    })
  } else if (shipClass.equal('GotlandClass')) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 2,
      evasion: 1
    })
  }

  return bonus
}

export default createBonus
