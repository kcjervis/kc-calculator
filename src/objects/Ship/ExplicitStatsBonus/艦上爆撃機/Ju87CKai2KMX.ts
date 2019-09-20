import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { ShipId } from "@jervis/data"

const createBonus: StatsBonusCreator = ship => {
  // Ju87C改二(KMX搭載機) Ju87C改二(KMX搭載機／熟練)
  const multiplier = ship.countGear(305) + ship.countGear(306)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  const isShinyou = [ShipId["神鷹"], ShipId["神鷹改"], ShipId["神鷹改二"]].includes(ship.masterId)
  if (shipClass.any("GrafZeppelinClass", "AquilaClass")) {
    bonus.add({ multiplier, firepower: 1, evasion: 1 })
  } else if (isShinyou) {
    bonus.add({ multiplier, asw: 3, evasion: 2 })
  } else if (shipClass.is("TaiyouClass")) {
    bonus.add({ multiplier, asw: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
