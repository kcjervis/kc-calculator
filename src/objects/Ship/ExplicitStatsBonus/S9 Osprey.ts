import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // S9 Osprey
  const count = ship.countGear(304)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass } = ship

  if (
    shipClass.is("KumaClass") ||
    shipClass.is("NagaraClass") ||
    shipClass.is("SendaiClass") ||
    shipClass.is("AganoClass")
  ) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      evasion: 1,
      asw: 1
    })
  } else if (shipClass.is("GotlandClass")) {
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
