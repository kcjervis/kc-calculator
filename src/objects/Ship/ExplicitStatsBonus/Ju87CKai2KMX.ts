import MasterShipId from '../../../data/MasterShipId'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Ju87C改二(KMX搭載機) Ju87C改二(KMX搭載機／熟練)
  const count = ship.countEquipment(305) + ship.countEquipment(306)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  const isShinyou = [MasterShipId.Shinyou, MasterShipId.ShinyouKai, MasterShipId.ShinyouKai2].includes(ship.masterId)
  if (shipClass.either('GrafZeppelinClass', 'AquilaClass')) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      evasion: 1
    })
  } else if (isShinyou) {
    bonus.add({
      multiplier: count,
      asw: 3,
      evasion: 2
    })
  } else if (shipClass.is('TaiyouClass')) {
    bonus.add({
      multiplier: count,
      asw: 1,
      evasion: 1
    })
  }

  return bonus
}

export default createBonus
