import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const bonusCreator: StatsBonusCreator = ship => {
  // SG レーダー(初期型)
  const multiplier = ship.countGear(315)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  // 単体ボーナス
  if (shipClass.any("JohnCButlerClass", "FletcherClass")) {
    bonus.add({ multiplier, firepower: 3, evasion: 3, los: 4 })
    bonus.add({ range: 1 })
  } else if (shipClass.isUsNavy) {
    bonus.add({ multiplier, firepower: 2, evasion: 3, los: 4 })
  }

  return bonus
}

export default bonusCreator
