import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Bofors15.2cm連装砲 Model1930
  const count = ship.countEquipment(303)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.either('KumaClass', 'NagaraClass', 'SendaiClass', 'AganoClass')) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 1
    })
  } else if (shipClass.is('GotlandClass')) {
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
