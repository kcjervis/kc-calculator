import { Speed } from '../../../constants'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 改良型艦本式タービン
  if (!ship.hasEquipment(33)) {
    return undefined
  }

  const speedGroup = Speed.getSpeedGroup(ship)
  const enhancedBoilerCount = ship.countEquipment(34)
  const newModelBoilerCount = ship.countEquipment(87)
  const speedIncrement = Speed.getSpeedIncrement(speedGroup, enhancedBoilerCount, newModelBoilerCount)

  if (speedIncrement > 0) {
    return new StatsBonus({
      speed: speedIncrement
    })
  }

  const isSamuel = [561, 681].includes(ship.masterId)
  if (isSamuel) {
    return new StatsBonus({
      speed: 5
    })
  }
  return undefined
}

export default createBonus
