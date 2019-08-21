import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(340)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.is('DucaDegliAbruzziClass')) {
    bonus.add({ multiplier, firepower: 1, antiAir: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
