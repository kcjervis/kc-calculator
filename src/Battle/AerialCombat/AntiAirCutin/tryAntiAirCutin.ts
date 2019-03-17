import { maxBy, random } from 'lodash-es'
import { IShip } from '../../../objects'
import AntiAirCutin from './AntiAirCutin'

const tryAntiAirCutin = (arg: IShip | IShip[]): AntiAirCutin | undefined => {
  if (Array.isArray(arg)) {
    const ships = arg
    const possibleAntiAirCutins = ships.map(tryAntiAirCutin)
    return maxBy(possibleAntiAirCutins, aaci => aaci && aaci.id)
  } else {
    const ship = arg
    const randomNum = random(100)
    const shipAaci = AntiAirCutin.getPossibleAntiAirCutins(ship).find(aaci => {
      if (aaci.id === 34 || aaci.id === 35) {
        return aaci.probability > random(100)
      }
      return aaci.probability > randomNum
    })
    return shipAaci
  }
}

export default tryAntiAirCutin
