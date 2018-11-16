import maxBy from 'lodash/maxBy'
import random from 'lodash/random'
import sumBy from 'lodash/sumBy'

import { Side } from '../../constants'
import AntiAirCutIn from '../../data/AntiAirCutIn'
import { IShip } from '../Ship'

import { IBaseFleet } from './BaseFleet'

export interface IFleetAerialCombat {
  /** 艦隊防空 */
  calculateFleetAntiAir: (formationModifier: number) => number
}

const calculateFleetAntiAir = (totalShipFleetAntiAir: number, side: Side, formationModifier: number) => {
  const postFloor = Math.floor(formationModifier * totalShipFleetAntiAir) * 2
  if (side === Side.Player) {
    return postFloor / 1.3
  }
  return postFloor
}

const tryAntiAirCutIn = (ships: IShip[]) => {
  const possibleAntiAirCutIns = new Array<AntiAirCutIn>()
  ships.forEach(ship => {
    const randomNum = random(100)
    const shipAntiAirCutIn = ship.aerialCombat.possibleAntiAirCutIns.find(aaci => aaci.probability > randomNum)
    if (shipAntiAirCutIn) {
      possibleAntiAirCutIns.push(shipAntiAirCutIn)
    }
  })
  return maxBy(possibleAntiAirCutIns, aaci => aaci.api)
}

export default class FleetAerialCombat implements IFleetAerialCombat {
  constructor(private readonly fleet: IBaseFleet) {}

  public calculateFleetAntiAir(formationModifier: number) {
    const { side, ships } = this.fleet
    const totalShipFleetAntiAir = sumBy(ships, ship => (ship ? ship.aerialCombat.fleetAntiAir : 0))
    return calculateFleetAntiAir(totalShipFleetAntiAir, side, formationModifier)
  }
}
