import { random } from 'lodash-es'
import { AirControlState, Side } from '../../constants'
import { IShip } from '../../objects'
import { softcap } from '../../utils'
import { ISidedNightBattleState } from './INightBattleState'
import NightBattleSpecialAttack from './NightBattleSpecialAttack'

const calcFitModifier = (ship: IShip) => {
  if (!ship.shipType.either('HeavyCruiser', 'AviationCruiser')) {
    return 0
  }

  if (ship.hasEquipment(6)) {
    // 20.3cm連装砲
    return 10
  } else if (ship.hasEquipment(90) || ship.hasEquipment(50)) {
    // 20.3cm(2号)連装砲 20.3cm(3号)連装砲 補正
    return 15
  }
  return 0
}

const calcNightBattleAccuracy = (
  ship: IShip,
  formationModifier: number,
  battleState: ISidedNightBattleState,
  specialAttack?: NightBattleSpecialAttack
) => {
  const { level } = ship
  const { luck } = ship.stats
  const { starshell, searchlight, contact } = battleState
  const starshellModifier = starshell ? 5 : 0
  const searchlightModifier = searchlight ? 7 : 0
  const contactModifier = contact ? contact.accuracyModifier : 1

  const moraleModifier = ship.morale.nightBattleAccuracyModifier
  const specialAttackModifier = specialAttack ? specialAttack.accuracyModifier : 1

  const baseValue = 1.5 * Math.sqrt(luck) + 2 * Math.sqrt(level)
  const equipTotal = ship.totalEquipmentStats('accuracy')

  let accuracyValue = Math.floor((69 + starshellModifier) * contactModifier + baseValue + equipTotal)
  accuracyValue *= formationModifier * moraleModifier * specialAttackModifier
  accuracyValue += searchlightModifier + calcFitModifier(ship)

  return Math.floor(accuracyValue)
}

const nightBattleAttack = (
  attacker: IShip,
  defender: IShip,
  isFlagship: boolean,
  attackerSideState: ISidedNightBattleState,
  defenderSideState: ISidedNightBattleState
) => {
  const specialAttacks = NightBattleSpecialAttack.getPossibleSpecialAttacks(attacker)
  const baseValue = NightBattleSpecialAttack.calcBaseValue(attacker, isFlagship, attackerSideState, defenderSideState)

  const nightBattleSpecialAttack = specialAttacks.find(specialAttack => {
    if (specialAttack === NightBattleSpecialAttack.DoubleAttack) {
      return 110 > random(specialAttack.typeFactor)
    }
    return baseValue > random(specialAttack.typeFactor - 1)
  })
}

const calcNightBattlePower = (ship: IShip, criticalModifier: number, specialAttack?: NightBattleSpecialAttack) => {
  const { firepower, torpedo } = ship.stats
  const baseValue = firepower + torpedo
  const specialAttackModifier = specialAttack ? specialAttack.powerModifier : 1
  const preCap = baseValue * specialAttackModifier * ship.health.shellingPowerModifier
  const postCap = Math.floor(softcap(300, preCap))
  return Math.floor(postCap * criticalModifier)
}
