import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // SG レーダー(初期型)
  const count = ship.countEquipment(315)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.either('JohnCButlerClass', 'FletcherClass')) {
    bonus.add({
      multiplier: count,
      firepower: 3,
      evasion: 3,
      los: 4
    })
    bonus.add({
      range: 1
    })
  } else if (shipClass.isUsNavy) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      evasion: 3,
      los: 4
    })
  }

  return bonus
}

export default bonusCreator
