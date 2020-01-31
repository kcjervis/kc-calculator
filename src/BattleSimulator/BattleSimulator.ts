import { IFleet, IShip, IPlane } from "../objects"
import { Formation } from "../common"
import { doAerialCombat } from "./AerialCombat"
import DamageCounter from "./DamageCounter"
import PlaneLossCounter from "./PlaneLossCounter"
import FleetInitialState from "./FleetInitialState"
import { times } from "lodash-es"

type Counter<K> = {
  increase: (key: K) => void
}

class Log<K, C extends Counter<K> = Counter<K>> {
  private data = new Map<K, C>()

  constructor(private creater: () => C) {}

  public update = (key: K) => {
    let counter = this.data.get(key)

    if (!counter) {
      counter = this.creater()
      this.data.set(key, counter)
    }

    counter.increase(key)
  }

  public entries = () => Array.from(this.data.entries())
}

class BattleRecord {
  public damageLog = new Log<IShip, DamageCounter>(() => new DamageCounter())
  public planeLossLog = new Log<IPlane, PlaneLossCounter>(() => new PlaneLossCounter())

  public update = (playerFleet: IFleet, enemyFleet: IFleet) => {
    enemyFleet.nonNullableShips.forEach(ship => {
      this.damageLog.update(ship)
    })

    playerFleet.planes.forEach(plane => {
      this.planeLossLog.update(plane)
    })
  }
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

    this.record.update(playerFleet, enemyFleet)
    this.init()
  }

  public do = (trialNumber: number) => {
    times(trialNumber, this.once)
    return this.record
  }
}
