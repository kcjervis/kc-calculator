import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 5inch単装砲 Mk.30改＋GFCS Mk.37
  const multiplier = ship.countGear(308)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass, shipType } = ship
  // 単体ボーナス
  if (shipClass.isUsNavy && shipType.is("Destroyer")) {
    bonus.add({ multiplier, firepower: 2, antiAir: 1, evasion: 1 })
  } else if (shipType.is("Destroyer")) {
    bonus.add({ multiplier, firepower: 1 })
  } else if (shipType.is("CoastalDefenseShip")) {
    bonus.add({ multiplier, antiAir: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
