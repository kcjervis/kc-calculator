import ShipMasterId from '../../../data/ShipMasterId'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // Ju87C改二(KMX搭載機) Ju87C改二(KMX搭載機／熟練)
  const count = ship.countEquipment(305) + ship.countEquipment(306)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const { shipClass } = ship

  const isShinyou = [ShipMasterId.Shinyou, ShipMasterId.ShinyouKai, ShipMasterId.ShinyouKai2].includes(ship.masterId)
  if (shipClass.equal('GrafZeppelinClass') || shipClass.equal('AquilaClass')) {
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
  } else if (shipClass.equal('TaiyouClass')) {
    bonus.add({
      multiplier: count,
      asw: 1,
      evasion: 1
    })
  }

  return bonus
}

export default createBonus
