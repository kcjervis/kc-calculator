import { Formation } from '../../constants'
import { IShip } from '../../objects'
import { softcap } from '../../utils'

export const shellingPower = (ship: IShip, formation: Formation, engagementModifier = 1, criticalModifier = 1) => {
  const { stats, health, totalEquipmentStats } = ship
  const basePower = 5 + stats.firepower + totalEquipmentStats(equip => equip.improvement.shellingPowerModifier)
  const preCap = basePower * formation.shellingPowerModifier * engagementModifier * health.shellingPowerModifier
  const postCap = Math.floor(softcap(180, preCap))
  const postCritical = Math.floor(postCap * criticalModifier)
  return postCritical
}

const calculateFitModifier = (ship: IShip) => 0

const shellingAccuracy = (
  ship: IShip,
  formation: Formation,
  fitBonus = 0,
  artillerySpottingAccuracyModifier = 1,
  apShellAccuracyModifier = 1
) => {
  const { stats, totalEquipmentStats, level, morale } = ship
  const totalEquipAccuracy = ship.totalEquipmentStats(
    equip => equip.accuracy + equip.improvement.shellingAccuracyModifier
  )
  const moraleModifier = ship.morale.shellingAccuracyModifier
  const formationModifier = formation.shellingAccuracyModifier

  const totalEquipmentAccuracy = totalEquipmentStats(
    equip => equip.accuracy + equip.improvement.shellingAccuracyModifier
  )
  const baseAccuracy = 90 + Math.sqrt(1.5 * stats.luck) + 2 * Math.sqrt(level) + totalEquipmentAccuracy

  const postFitBonus = baseAccuracy * formation.shellingAccuracyModifier * morale.shellingAccuracyModifier + fitBonus
  return Math.floor(postFitBonus * artillerySpottingAccuracyModifier * apShellAccuracyModifier)
}
