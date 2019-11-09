import StatsBonus, { StatsBonusCreator } from "../StatsBonus"

/** 13号対空電探改 */
const bonusCreator: StatsBonusCreator = ship => {
  const count = ship.countGear(106)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipNameIs = (name: string) =>
    ["", "改", "乙改", "改二", "改二乙", "改ニ丁"].map(grade => name + grade).includes(ship.name)

  // 単体ボーナス
  if (["潮改二", "時雨改二", "初霜改二", "榛名改二", "長門改二"].includes(ship.name)) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 2,
      evasion: 3,
      armor: 1
    })
  } else if (["矢矧", "霞", "雪風", "磯風", "浜風", "朝霜", "涼月"].some(shipNameIs)) {
    bonus.add({
      multiplier: count,
      antiAir: 2,
      evasion: 2,
      armor: 1
    })
  } else if (["大淀", "響", "鹿島"].some(shipNameIs) || ship.masterId === 147 /** Верный */) {
    bonus.add({
      multiplier: count,
      antiAir: 1,
      evasion: 3,
      armor: 1
    })
  }

  return bonus
}

export default bonusCreator
