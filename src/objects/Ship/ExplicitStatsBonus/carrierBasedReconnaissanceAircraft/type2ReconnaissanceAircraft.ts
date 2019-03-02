import { maxBy } from 'lodash-es'
import { IEquipment } from '../../../Equipment'
import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 二式艦上偵察機
  const type2Recons = ship.equipments.filter((equip): equip is IEquipment => (equip ? equip.masterId === 61 : false))
  const type2Recon = maxBy(type2Recons, equip => equip.improvement.value)
  if (!type2Recon) {
    return undefined
  }
  const bonus = new StatsBonus()
  const improvementValue = type2Recon.improvement.value

  if (ship.name === '伊勢改二') {
    bonus.add({ firepower: 3, evasion: 2, armor: 1 })
    const longRange = 3
    // 長射程シナジー
    if (ship.hasEquipment(equip => equip.range >= longRange)) {
      bonus.add({ range: 1 })
    }
  }

  if (ship.name === '蒼龍改二') {
    if (improvementValue >= 1) {
      bonus.add({ firepower: 3, los: 3 })
    }
    if (improvementValue >= 8) {
      bonus.add({ firepower: 1, los: 1 })
    }
  }

  if (ship.name === '飛龍改二') {
    if (improvementValue >= 1) {
      bonus.add({ firepower: 2, los: 2 })
    }
  }

  if (['瑞鳳改二乙', '鈴谷航改二', '熊野航改二'].includes(ship.name)) {
    if (improvementValue >= 1) {
      bonus.add({ firepower: 1, los: 1 })
    }
  }

  return bonus
}

export default createBonus
