import { IShip, IFleet } from "../objects"
import { AirControlState } from "../common"
import { sumBy, random } from "lodash-es"

type SpecialAttackConfig = {
  id: number
  name: string
  typeFactor: number
  power: number
  accuracy: number
}

export default class DayCombatSpecialAttack {
  public static all: DayCombatSpecialAttack[] = []

  public static MainMain = new DayCombatSpecialAttack(6, "主主", 150, { power: 1.5, accuracy: 1.2 })
  public static MainApShell = new DayCombatSpecialAttack(5, "主徹", 140, { power: 1.3, accuracy: 1.3 })
  public static MainRader = new DayCombatSpecialAttack(4, "主電", 130, { power: 1.2, accuracy: 1.5 })
  public static MainSecond = new DayCombatSpecialAttack(3, "主副", 120, { power: 1.1, accuracy: 1.3 })
  public static DoubleAttack = new DayCombatSpecialAttack(2, "連撃", 130, { power: 1.2, accuracy: 1.1 })

  public static FighterBomberAttacker = new DayCombatSpecialAttack(7.1, "FBA", 125, { power: 1.25, accuracy: 1 })
  public static BomberBomberAttacker = new DayCombatSpecialAttack(7.2, "BBA", 140, { power: 1.2, accuracy: 1 })
  public static BomberAttacker = new DayCombatSpecialAttack(7.3, "BA", 155, { power: 1.15, accuracy: 1 })

  private static getPossibleAircraftCarrierCutins = (ship: IShip) => {
    const cutins = new Array<DayCombatSpecialAttack>()

    const planes = ship.planes.filter(({ slotSize }) => slotSize > 0)
    const bomberCount = planes.filter(plane => plane.is("CarrierBasedDiveBomber")).length
    const hasTorpedoBomber = planes.some(plane => plane.is("CarrierBasedTorpedoBomber"))

    if (bomberCount === 0 || !hasTorpedoBomber) {
      return cutins
    }
    cutins.push(DayCombatSpecialAttack.BomberAttacker)

    if (bomberCount >= 2) {
      cutins.push(DayCombatSpecialAttack.BomberBomberAttacker)
    }

    const hasFighter = planes.some(plane => plane.is("CarrierBasedFighterAircraft"))
    if (hasFighter) {
      cutins.push(DayCombatSpecialAttack.FighterBomberAttacker)
    }

    return cutins.sort((ci1, ci2) => ci1.typeFactor - ci2.typeFactor)
  }

  private static getPossibleArtillerySpottings = (ship: IShip) => {
    const attacks = new Array<DayCombatSpecialAttack>()

    const hasObservationSeaplane = ship.planes.some(
      plane => (plane.slotSize > 0 && plane.is("ReconnaissanceSeaplane")) || plane.is("SeaplaneBomber")
    )
    const mainGunCount = ship.countGear(gear => gear.is("MainGun"))
    if (!hasObservationSeaplane || mainGunCount === 0) {
      return attacks
    }

    const hasApShell = ship.hasGear(gear => gear.is("ArmorPiercingShell"))
    const hasSecondaryGun = ship.hasGear(gear => gear.is("SecondaryGun"))
    const hasRader = ship.hasGear(gear => gear.is("Radar"))

    if (mainGunCount >= 2) {
      attacks.push(DayCombatSpecialAttack.DoubleAttack)
      if (hasApShell) {
        attacks.push(DayCombatSpecialAttack.MainMain)
      }
    }

    if (hasSecondaryGun) {
      attacks.push(DayCombatSpecialAttack.MainSecond)
      if (hasRader) {
        attacks.push(DayCombatSpecialAttack.MainRader)
      }
      if (hasApShell) {
        attacks.push(DayCombatSpecialAttack.MainApShell)
      }
    }

    return attacks.sort((attack1, attack2) => attack2.id - attack1.id)
  }

  public static getPossibleAttacks = (ship: IShip, isAntiInstallation = false): DayCombatSpecialAttack[] => {
    if (ship.health.damage === "Taiha") {
      return []
    }

    if (ship.shipType.isAircraftCarrierClass && !isAntiInstallation) {
      return DayCombatSpecialAttack.getPossibleAircraftCarrierCutins(ship)
    }

    return DayCombatSpecialAttack.getPossibleArtillerySpottings(ship)
  }

  public static calcFleetLosModifier = (fleet: IFleet) => {
    const base = fleet.totalShipStats(ship => ship.fleetLosFactor)
    return Math.floor(Math.sqrt(base) + 0.1 * base)
  }

  public static calcBaseValue = (
    ship: IShip,
    fleetLosModifier: number,
    airControlState: AirControlState,
    isFlagship?: boolean
  ) => {
    const { luck } = ship.stats
    const luckFactor = Math.floor(Math.sqrt(luck) + 10)
    const equipmentLos = ship.totalEquipmentStats("los")
    const flagshipFactor = isFlagship ? 15 : 0
    if (airControlState === AirControlState.AirSupremacy) {
      return Math.floor(luckFactor + 0.7 * (fleetLosModifier + 1.6 * equipmentLos) + 10) + flagshipFactor
    } else if (airControlState === AirControlState.AirSuperiority) {
      return Math.floor(luckFactor + 0.6 * (fleetLosModifier + 1.2 * equipmentLos)) + flagshipFactor
    }
    return 0
  }

  public static calcRate = (
    ship: IShip,
    fleetLosModifier: number,
    airControlState: AirControlState,
    isFlagship?: boolean
  ) => {
    const baseValue = DayCombatSpecialAttack.calcBaseValue(ship, fleetLosModifier, airControlState, isFlagship)
    const rateMap = new Map<DayCombatSpecialAttack, number>()

    const attacks = DayCombatSpecialAttack.getPossibleAttacks(ship)

    const total = attacks.reduce((acc, curAttack) => {
      let currentRate = (1 - acc) * (baseValue / curAttack.typeFactor)
      if (currentRate > 1) {
        currentRate = 1
      }
      rateMap.set(curAttack, currentRate)
      return acc + currentRate
    }, 0)

    const normalAttackRate = 1 - total
    const isSpecialAttackOnly = normalAttackRate <= 0

    type DayCombatAttack = DayCombatSpecialAttack | undefined
    const dayCombatAttacks: DayCombatAttack[] = attacks.concat()
    if (!isSpecialAttackOnly) {
      dayCombatAttacks.unshift(undefined)
    }

    const getAttackRate = (attack: DayCombatAttack) => {
      if (!attack) {
        return normalAttackRate
      }
      return rateMap.get(attack) || 0
    }

    const entries = () => dayCombatAttacks.map(attack => [attack, getAttackRate(attack)] as const)

    return { baseValue, attacks, rateMap, total, dayCombatAttacks, getAttackRate, entries }
  }

  public static try = (
    ship: IShip,
    fleetLosModifier: number,
    airControlState: AirControlState,
    isFlagship?: boolean
  ) => {
    const baseValue = DayCombatSpecialAttack.calcBaseValue(ship, fleetLosModifier, airControlState, isFlagship)
    const attacks = DayCombatSpecialAttack.getPossibleAttacks(ship)

    for (const attack of attacks) {
      if (baseValue > random(attack.typeFactor - 1)) {
        return attack
      }
    }

    return undefined
  }

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly typeFactor: number,
    public readonly modifier: { power: number; accuracy: number }
  ) {
    DayCombatSpecialAttack.all.push(this)
  }

  get api() {
    return Math.floor(this.id)
  }

  get isCarrierSpecialAttack() {
    return this.api === 7
  }
}
