import MasterShipId from "../../../../data/MasterShipId"
import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // Ju87C改二(KMX搭載機) Ju87C改二(KMX搭載機／熟練)
  const multiplier = ship.countGear(305) + ship.countGear(306)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  const isShinyou = [MasterShipId.Shinyou, MasterShipId.ShinyouKai, MasterShipId.ShinyouKai2].includes(ship.masterId)
  if (shipClass.either("GrafZeppelinClass", "AquilaClass")) {
    bonus.add({ multiplier, firepower: 1, evasion: 1 })
  } else if (isShinyou) {
    bonus.add({ multiplier, asw: 3, evasion: 2 })
  } else if (shipClass.is("TaiyouClass")) {
    bonus.add({ multiplier, asw: 1, evasion: 1 })
  }

  return bonus
}

export default createBonus
