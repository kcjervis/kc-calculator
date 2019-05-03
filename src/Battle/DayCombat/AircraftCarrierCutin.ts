import { IShip } from '../../objects'
import { calculateArtillerySpottingBaseValue, calculateFleetLosModifier } from './ArtillerySpotting'

// https://docs.google.com/spreadsheets/d/1i5jTixnOVjqrwZvF_4Uqf3L9ObHhS7dFqG8KiE5awkY

export default class AircraftCarrierCutin {
  public static all: AircraftCarrierCutin[] = []

  public static FighterBomberAttacker = new AircraftCarrierCutin('FBA', 1.25, 125)
  public static BomberBomberAttacker = new AircraftCarrierCutin('BBA', 1.2, 140)
  public static BomberAttacker = new AircraftCarrierCutin('BA', 1.15, 155)

  public static calculateFleetLosModifier = calculateFleetLosModifier
  public static calculateAircraftCarrierCutinBaseValue = calculateArtillerySpottingBaseValue

  public static getPossibleAircraftCarrierCutins = (ship: IShip) => {
    const cutins = new Array<AircraftCarrierCutin>()

    if (!ship.shipType.isAircraftCarrierClass) {
      return cutins
    }

    const planes = ship.planes.filter(({ slotSize }) => slotSize > 0)
    const bomberCount = planes.filter(plane => plane.category.is('CarrierBasedDiveBomber')).length
    const hasTorpedoBomber = planes.some(plane => plane.category.is('CarrierBasedTorpedoBomber'))
    if (bomberCount === 0 || !hasTorpedoBomber) {
      return cutins
    }
    cutins.push(AircraftCarrierCutin.BomberAttacker)

    if (bomberCount >= 2) {
      cutins.push(AircraftCarrierCutin.BomberBomberAttacker)
    }

    const hasFighter = planes.some(plane => plane.category.is('CarrierBasedFighterAircraft'))
    if (hasFighter) {
      cutins.push(AircraftCarrierCutin.FighterBomberAttacker)
    }

    return cutins.sort((ci1, ci2) => ci1.typeFactor - ci2.typeFactor)
  }

  constructor(public readonly name: string, public readonly powerModifier: number, public readonly typeFactor: number) {
    AircraftCarrierCutin.all.push(this)
  }
}
