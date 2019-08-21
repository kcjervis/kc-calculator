import { Speed } from '../../../constants'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 改良型艦本式タービン
  if (!ship.hasGear(33)) {
    return undefined
  }

  const speedGroup = Speed.getSpeedGroup(ship)
  const enhancedBoilerCount = ship.countGear(34)
  const newModelBoilerCount = ship.countGear(87)
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
