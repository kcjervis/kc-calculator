import { nonNullable } from '../../../../utils'
import StatsBonus, { StatsBonusCreator } from '../StatsBonus'
import 二式艦上偵察機 from './二式艦上偵察機'

const improvementBonus: StatsBonusCreator = ship => {
  const improvements = ship.equipments
    .filter(nonNullable)
    .filter(equip => equip.category.either('CarrierBasedReconnaissanceAircraft', 'CarrierBasedReconnaissanceAircraft2'))
    .map(recon => recon.improvement.value)

  if (improvements.length === 0) {
    return undefined
  }
  const bonus = new StatsBonus()
  const improvementValue = Math.max(...improvements)
  if (improvementValue >= 10) {
    bonus.add({ firepower: 2, los: 3 })
  } else if (improvementValue >= 6) {
    bonus.add({ firepower: 1, los: 2 })
  } else if (improvementValue >= 4) {
    bonus.add({ firepower: 1, los: 1 })
  } else if (improvementValue >= 2) {
    bonus.add({ los: 1 })
  }

  return bonus
}

export default [improvementBonus, 二式艦上偵察機]
