import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 九七式艦攻(九三一空) 九七式艦攻(九三一空／熟練)
  const multiplier = ship.countGear(82) + ship.countGear(302)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  if (ship.shipClass.is("TaiyouClass")) {
    bonus.add({ multiplier, asw: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
