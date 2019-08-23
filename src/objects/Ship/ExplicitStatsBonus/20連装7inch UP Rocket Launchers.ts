import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 20連装7inch UP Rocket Launchers
  const count = ship.countGear(301)
  if (count === 0) {
    return undefined
  }

  const { shipClass } = ship

  if (!shipClass.isRoyalNavy) {
    return undefined
  }

  return new StatsBonus({
    multiplier: count,
    antiAir: 2,
    evasion: 1,
    armor: 1
  })
}

export default createBonus
