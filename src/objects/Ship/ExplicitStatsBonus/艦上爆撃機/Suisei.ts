import StatsBonus, { StatsBonusCreator } from "../StatsBonus"
import { shipNameIsKai2 } from "../../../../utils"

const createBonus: StatsBonusCreator = ship => {
  const isKai2 = shipNameIsKai2(ship.name)
  const isIseClassKai2 = ship.shipClass.is("IseClass") && isKai2
  if (!isIseClassKai2) {
    return undefined
  }

  const model22634AirGroup = ship.countGear(291)
  const model22634AirGroupSkilled = ship.countGear(292)
  const otherSuiseiCount = ship.countGear(24) + ship.countGear(57) + ship.countGear(111)
  const bonus = new StatsBonus()

  if (model22634AirGroup) {
    bonus.add({ multiplier: model22634AirGroup, firepower: 6, evasion: 1 })
  }

  if (model22634AirGroupSkilled) {
    bonus.add({ multiplier: model22634AirGroupSkilled, firepower: 8, antiAir: 1, evasion: 2 })
  }

  if (otherSuiseiCount) {
    bonus.add({ multiplier: otherSuiseiCount, firepower: 2 })
  }

  return bonus
}

export default createBonus
