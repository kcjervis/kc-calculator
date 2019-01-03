import sumBy from 'lodash/sumBy'
import { AirControlState } from '../../constants'
import { IFleet, IShip } from '../../objects'

export const calculateFleetLosModifier = (fleet: IFleet) => {
  const totalNakedLos = fleet.totalShipStats(ship => ship.nakedStats.los)
  const totalSeaplanesLos = sumBy(fleet.planes, plane => plane.fleetLosModifier)
  const base = totalNakedLos + totalSeaplanesLos
  return Math.floor(Math.sqrt(base) + 0.1 * base)
}

export const calculateArtillerySpottingBaseValue = (
  ship: IShip,
  fleetLosModifier: number,
  airControlState: AirControlState,
  isFlagship?: boolean
) => {
  const { luck } = ship.stats
  const luckFactor = Math.sqrt(luck) + 10
  const equipmentsFactor = ship.totalEquipmentStats('los')
  const flagshipFactor = isFlagship ? 15 : 0
  if (airControlState === AirControlState.AirSupremacy) {
    return Math.floor(luckFactor + 0.7 * (fleetLosModifier + 1.6 * equipmentsFactor) + 10) + flagshipFactor
  } else if (airControlState === AirControlState.AirSuperiority) {
    return Math.floor(luckFactor + 0.6 * (fleetLosModifier + 1.2 * equipmentsFactor)) + flagshipFactor
  }
  return 0
}

export const getPossibleArtillerySpottings = (ship: IShip) => {
  const artillerySpottings = new Array<ArtillerySpotting>()
  if (ship.health.damage === 'Heavy') {
    return artillerySpottings
  }
  const hasObservationPlane = ship.planes.some(plane => plane.category.isObservationPlane && plane.slotSize > 0)
  const mainGunCount = ship.countEquipment(({ category }) => category.isMainGun)
  if (!hasObservationPlane || mainGunCount === 0) {
    return artillerySpottings
  }

  const hasApShell = ship.hasEquipment(equip => equip.category.is('ArmorPiercingShell'))
  const hasSecondaryGun = ship.hasEquipment(equip => equip.category.is('SecondaryGun'))
  const hasRader = ship.hasEquipment(equip => equip.category.isRadar)

  if (mainGunCount >= 2) {
    artillerySpottings.push(ArtillerySpotting.DoubleAttack)
    if (hasApShell) {
      artillerySpottings.push(ArtillerySpotting.MainMaim)
    }
  }

  if (hasSecondaryGun) {
    artillerySpottings.push(ArtillerySpotting.MainSec)
    if (hasRader) {
      artillerySpottings.push(ArtillerySpotting.MainRader)
    }
    if (hasApShell) {
      artillerySpottings.push(ArtillerySpotting.MainAp)
    }
  }

  return artillerySpottings.sort((ci1, ci2) => ci2.id - ci1.id)
}

export default class ArtillerySpotting {
  public static all: ArtillerySpotting[] = []
  public static MainMaim = new ArtillerySpotting(6, '主主', 150)
  public static MainAp = new ArtillerySpotting(5, '主徹', 140)
  public static MainRader = new ArtillerySpotting(4, '主電', 130)
  public static MainSec = new ArtillerySpotting(3, '主副', 120)
  public static DoubleAttack = new ArtillerySpotting(2, '連撃', 130)

  public static calculateFleetLosModifier = calculateFleetLosModifier

  public static calculateArtillerySpottingBaseValue = calculateArtillerySpottingBaseValue

  public static getPossibleArtillerySpottings = getPossibleArtillerySpottings

  constructor(public readonly id: number, public readonly name: string, public readonly typeFactor: number) {
    ArtillerySpotting.all.push(this)
  }
}
