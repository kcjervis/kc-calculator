import { IFleet, IPlane, IShip } from "../objects"
import Airstrike from "./Airstrike"
import { Formation, AirControlState } from "../common"
import { sample } from "../utils"
import { times } from "lodash-es"
import DamageCounter from "./DamageCounter"
import Contact from "./Contact"

const isAirstrikePlanes = (plane: IPlane) => plane.slotSize > 0 && (plane.is("TorpedoBomber") || plane.is("DiveBomber"))

class AirstrikeRecord {
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

const reset = ({ health }: IShip) => {
  health.currentHp = health.maxHp
}

export default class AirstrikeSimulator {
  public record = new AirstrikeRecord()

  constructor(private playerFleet: IFleet, private enemyFleet: IFleet, private enemyFormation: Formation) {}

  private get protectionRate() {
    const formation = this.enemyFormation

    if (formation === Formation.LineAhead) {
      return 0.45
    }
    if (formation === Formation.Diamond) {
      return 0.75
    }
    return 0.6
  }

  private getTarget = () => {
    const ships = this.enemyFleet.nonNullableShips
    const target = sample(ships)
    const flagship = ships[0]

    if (target !== flagship) {
      return target
    }

    const protects = Math.random() < this.protectionRate
    if (!protects) {
      return target
    }

    const protectiveShips = ships.filter(
      ship => ship !== target && !ship.isInstallation && ship.health.damage === "Less"
    )

    if (protectiveShips.length === 0) {
      return target
    }

    return sample(protectiveShips)
  }

  private reset = () => {
    this.enemyFleet.nonNullableShips.forEach(reset)
  }

  public once = () => {
    const { playerFleet, enemyFleet } = this

    const airState = AirControlState.fromFighterPower(playerFleet.fighterPower, enemyFleet.fighterPower)

    const contactModifier = new Contact(playerFleet.planes).getContactModifier(airState)

    this.playerFleet.nonNullableShips.forEach(ship => {
      const proficiencyModifiers = ship.getNormalProficiencyModifiers()

      const attackers = ship.planes.filter(isAirstrikePlanes)

      const doAirstrike = (plane: IPlane) => {
        const target = this.getTarget()
        const airstrike = new Airstrike({
          plane,
          target,
          contactModifier,
          proficiencyModifiers
        })

        airstrike.do()
      }

      attackers.forEach(doAirstrike)
    })

    this.enemyFleet.nonNullableShips.map(this.record.update)
    this.reset()
  }

  public do = (trialNumber: number) => {
    times(trialNumber, this.once)
    return this.record
  }
}
