import { IFleet, IShip } from "../objects"
import { Formation } from "../common"
import { doAerialCombat } from "./AerialCombat"
import DamageCounter from "./DamageCounter"
import FleetInitialState from "./FleetInitialState"
import { times } from "lodash-es"

class BattleRecord {
  private data = new Map<IShip, DamageCounter>()

  private getCounter = (ship: IShip) => {
    let counter = this.data.get(ship)
    if (!counter) {
      counter = new DamageCounter()
      this.data.set(ship, counter)
    }
    return counter
  }

  public update = (ship: IShip) => {
    const counter = this.getCounter(ship)
    counter[ship.health.damage] += 1
  }

  public entries = () => this.data.entries()
}

export default class BattleSimulator {
  private initialState: {
    playerFleet: FleetInitialState
    enemyFleet: FleetInitialState
  }

  public record = new BattleRecord()

  constructor(private playerFleet: IFleet, private enemyFleet: IFleet, private enemyFormation: Formation) {
    this.initialState = {
      playerFleet: new FleetInitialState(playerFleet),
      enemyFleet: new FleetInitialState(enemyFleet)
    }
  }

  private init = () => {
    const { playerFleet, enemyFleet } = this.initialState
    playerFleet.init()
    enemyFleet.init()
  }

  private once = () => {
    const { playerFleet, enemyFleet, enemyFormation } = this
    const airControlState = doAerialCombat({ playerFleet, enemyFleet, enemyFormation })

    enemyFleet.nonNullableShips.forEach(this.record.update)
    this.init()
  }

  public do = (trialNumber: number) => {
    times(trialNumber, this.once)
    return this.record
  }
}
