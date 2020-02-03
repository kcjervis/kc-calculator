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

class SunkCounter {
  private data = new Map<number, number>()

  private get total() {
    let total = 0
    this.data.forEach(value => {
      total += value
    })
    return total
  }

  public increase = (value: number) => {
    const count = this.data.get(value)
    if (!count) {
      this.data.set(value, 1)
    } else {
      this.data.set(value, count + 1)
    }
  }

  private getRate = (value: number) => {
    const count = this.data.get(value) ?? 0
    return count / this.total
  }

  public getRateList = () => {
    const list: Array<[number, number]> = []

    this.data.forEach((_, count) => {
      list.push([count, this.getRate(count)])
    })

    let cumulative = 0
    return list
      .sort(([count1], [count2]) => count2 - count1)
      .map(([count, rate]) => {
        cumulative += rate
        return [count, rate, cumulative]
      })
  }
}

class BattleRecord {
  public damageLog = new Log<IShip, DamageCounter>(() => new DamageCounter())
  public planeLossLog = new Log<IPlane, PlaneLossCounter>(() => new PlaneLossCounter())

  public sunkCounter = new SunkCounter()

  public update = (playerFleet: IFleet, enemyFleet: IFleet) => {
    enemyFleet.nonNullableShips.forEach(ship => {
      this.damageLog.update(ship)
    })

    const sunkCount = enemyFleet.nonNullableShips.filter(ship => ship.health.damage === "Sunk").length
    this.sunkCounter.increase(sunkCount)

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
