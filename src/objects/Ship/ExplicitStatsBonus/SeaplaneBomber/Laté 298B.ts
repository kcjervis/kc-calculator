import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { GearId, ShipId } from "@jervis/data"

const createBonus: StatsBonusCreator = ship => {
  const multiplier = ship.countGear(GearId["Laté 298B"])
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  if (ship.shipId === ShipId["Richelieu改"]) {
    bonus.add({ multiplier, firepower: 1, evasion: 2, los: 2 })
  }
  if (ship.shipClass.is("CommandantTesteClass")) {
    bonus.add({ multiplier, firepower: 3, evasion: 2, los: 2 })
  }
  if (ship.shipClass.any("MizuhoClass", "KamoiClass")) {
    bonus.add({ multiplier, evasion: 1, los: 2 })
  }

  return bonus
}

export default createBonus
