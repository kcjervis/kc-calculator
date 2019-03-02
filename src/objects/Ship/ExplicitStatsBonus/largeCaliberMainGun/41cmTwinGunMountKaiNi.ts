import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // 41cm連装砲改二
  const multiplier = ship.countEquipment(318)
  if (multiplier === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const isNagatoClassKai2 = ship.shipClass.is('NagatoClass') && ship.name.includes('改二')
  const isIseClassAviationBattleship = ship.shipType.is('AviationBattleship') && ship.shipClass.is('IseClass')

  // 単体ボーナス
  if (isNagatoClassKai2) {
    bonus.add({ multiplier, firepower: 3, antiAir: 2, evasion: 1 })
  }

  if (isIseClassAviationBattleship) {
    bonus.add({ multiplier, firepower: 2, antiAir: 2, evasion: 2 })
  }

  if (ship.shipClass.is('FusouClass') && ship.name.includes('改二')) {
    bonus.add({ multiplier, firepower: 1 })
  }

  // シナジー
  // 41cm三連装砲改二
  if (ship.hasEquipment(290)) {
    if (isNagatoClassKai2) {
      bonus.add({ firepower: 2, evasion: 2, armor: 1 })
    }
    if (isIseClassAviationBattleship) {
      bonus.add({ evasion: 2, armor: 1 })
    }
  }
  // 対空電探
  if (ship.hasEquipment(equip => equip.isAntiAirRadar) && isIseClassAviationBattleship) {
    bonus.add({ antiAir: 2, evasion: 3 })
  }

  return bonus
}

export default createBonus
