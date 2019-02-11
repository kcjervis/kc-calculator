import MasterShipId from '../../../../data/MasterShipId'
import StatsBonus, { StatsBonusCreator } from '../StatsBonus'

const bonusCreator: StatsBonusCreator = ship => {
  // 20.3cm(2号)連装砲
  const count = ship.countEquipment(90)
  if (count === 0) {
    return undefined
  }
  const bonus = new StatsBonus()

  const { shipClass, name } = ship
  const isAoba = name.includes('青葉')

  // 単体ボーナス
  if ([MasterShipId.FurutakaKai2, MasterShipId.KakoKai2, MasterShipId.KinugasaKai].includes(ship.masterId)) {
    bonus.add({
      multiplier: count,
      firepower: 1
    })
  }
  if (MasterShipId.AobaKai === ship.masterId) {
    bonus.add({
      multiplier: count,
      firepower: 1,
      antiAir: 1
    })
  }
  if (MasterShipId.KinugasaKai2 === ship.masterId) {
    bonus.add({
      multiplier: count,
      firepower: 2,
      evasion: 1
    })
  }

  // 相互シナジーボーナス
  if (ship.hasEquipment(equip => equip.isSurfaceRadar)) {
    if (shipClass.is('FurutakaClass') || shipClass.is('AobaClass')) {
      bonus.add({
        firepower: 3,
        torpedo: 2,
        evasion: 2
      })
    }
  }

  if (ship.hasEquipment(equip => equip.isAntiAirRadar)) {
    if (isAoba) {
      bonus.add({
        antiAir: 5,
        evasion: 2
      })
    }
  }

  return bonus
}

export default bonusCreator
