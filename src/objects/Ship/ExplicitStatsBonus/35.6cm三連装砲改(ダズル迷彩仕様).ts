import StatsBonus, { StatsBonusCreator } from "./StatsBonus"

const createBonus: StatsBonusCreator = ship => {
  // 35.6cm三連装砲改(ダズル迷彩仕様)
  const count289 = ship.countGear(289)
  if (count289 === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const shipName = ship.name

  // 単体ボーナス
  if (shipName === "金剛改二") {
    bonus.add({
      multiplier: count289,
      firepower: 2,
      antiAir: 1
    })
  } else if (shipName === "榛名改二") {
    bonus.add({
      multiplier: count289,
      firepower: 2,
      antiAir: 2,
      evasion: 2
    })
  } else if (shipName === "比叡改二" || shipName === "霧島改二") {
    bonus.add({
      multiplier: count289,
      firepower: 1
    })
  }

  // 相互シナジーボーナス
  // 水上電探
  if (ship.hasGear(gear => gear.is("SurfaceRadar"))) {
    if (shipName === "金剛改二" || shipName === "榛名改二") {
      bonus.add({
        firepower: 2,
        evasion: 2
      })
    }
  }

  return bonus
}

export default createBonus
