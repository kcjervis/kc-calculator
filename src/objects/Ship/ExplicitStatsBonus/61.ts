import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  const isKai2 = ship.name.includes('改二')
  const isIseClassKai2 = ship.shipClass.is('IseClass') && isKai2
  // 二式艦上偵察機
  if (!isIseClassKai2 || !ship.hasEquipment(61)) {
    return undefined
  }

  const bonus = new StatsBonus()
  // 累積しない
  bonus.add({
    firepower: 3,
    evasion: 2
  })

  const longRange = 3
  const hasLongRange = ship.hasEquipment(equip => equip.range >= longRange)
  // 長射程シナジー
  if (hasLongRange) {
    bonus.add({
      range: 1
    })
  }
  return bonus
}

export default createBonus
