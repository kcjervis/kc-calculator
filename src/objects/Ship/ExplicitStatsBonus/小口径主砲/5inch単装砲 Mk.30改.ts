import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 5inch単装砲 Mk.30改
  const count = ship.countEquipment(313)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass, shipType } = ship

  // 単体ボーナス
  if (shipClass.isUsNavy && shipType.is('Destroyer')) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      antiAir: 2,
      evasion: 1,
      armor: 1
    })
  }
  return bonus
}

export default bonusCreator
