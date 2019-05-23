import { IShip, IFleet } from '../../objects'
import { AirControlState } from '../../constants'
import { sumBy, random } from 'lodash-es'

export default class DayCombatSpecialAttack {
  public static all: DayCombatSpecialAttack[] = []

  public static MainMain = new DayCombatSpecialAttack(6, '主主', 1.5, 150)
  public static MainApShell = new DayCombatSpecialAttack(5, '主徹', 1.3, 140)
  public static MainRader = new DayCombatSpecialAttack(4, '主電', 1.2, 130)
  public static MainSecond = new DayCombatSpecialAttack(3, '主副', 1.1, 120)
  public static DoubleAttack = new DayCombatSpecialAttack(2, '連撃', 1.2, 130)

  public static FighterBomberAttacker = new DayCombatSpecialAttack(7.1, 'FBA', 1.25, 125)
  public static BomberBomberAttacker = new DayCombatSpecialAttack(7.2, 'BBA', 1.2, 140)
  public static BomberAttacker = new DayCombatSpecialAttack(7.3, 'BA', 1.15, 155)

  private static getPossibleAircraftCarrierCutins = (ship: IShip) => {
    const cutins = new Array<DayCombatSpecialAttack>()

    const planes = ship.planes.filter(({ slotSize }) => slotSize > 0)
    const bomberCount = planes.filter(plane => plane.category.is('CarrierBasedDiveBomber')).length
    const hasTorpedoBomber = planes.some(plane => plane.category.is('CarrierBasedTorpedoBomber'))

    if (bomberCount === 0 || !hasTorpedoBomber) {
      return cutins
    }
    cutins.push(DayCombatSpecialAttack.BomberAttacker)

    if (bomberCount >= 2) {
      cutins.push(DayCombatSpecialAttack.BomberBomberAttacker)
    }

    const hasFighter = planes.some(plane => plane.category.is('CarrierBasedFighterAircraft'))
    if (hasFighter) {
      cutins.push(DayCombatSpecialAttack.FighterBomberAttacker)
    }

    return cutins.sort((ci1, ci2) => ci1.typeFactor - ci2.typeFactor)
  }

  private static getPossibleArtillerySpottings = (ship: IShip) => {
    const attacks = new Array<DayCombatSpecialAttack>()

    const hasObservationPlane = ship.planes.some(plane => plane.category.isObservationPlane && plane.slotSize > 0)
    const mainGunCount = ship.countEquipment(({ category }) => category.isMainGun)
    if (!hasObservationPlane || mainGunCount === 0) {
      return attacks
    }

    const hasApShell = ship.hasEquipment(equip => equip.category.is('ArmorPiercingShell'))
    const hasSecondaryGun = ship.hasEquipment(equip => equip.category.is('SecondaryGun'))
    const hasRader = ship.hasEquipment(equip => equip.category.isRadar)

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

  public static getPossibleAttacks = (ship: IShip): DayCombatSpecialAttack[] => {
    if (ship.health.damage === 'Heavy') {
      return []
    }

    if (ship.shipType.isAircraftCarrierClass) {
      return DayCombatSpecialAttack.getPossibleAircraftCarrierCutins(ship)
    }

    return DayCombatSpecialAttack.getPossibleArtillerySpottings(ship)
  }

  public static calcFleetLosModifier = (fleet: IFleet) => {
    const totalNakedLos = fleet.totalShipStats(ship => ship.nakedStats.los)
    const totalSeaplanesLos = sumBy(fleet.planes, plane => plane.fleetLosModifier)
    const base = totalNakedLos + totalSeaplanesLos
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
    const equipmentsFactor = ship.totalEquipmentStats('los')
    const flagshipFactor = isFlagship ? 15 : 0
    if (airControlState === AirControlState.AirSupremacy) {
      return Math.floor(luckFactor + 0.7 * (fleetLosModifier + 1.6 * equipmentsFactor) + 10) + flagshipFactor
    } else if (airControlState === AirControlState.AirSuperiority) {
      return Math.floor(luckFactor + 0.6 * (fleetLosModifier + 1.2 * equipmentsFactor)) + flagshipFactor
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

    return { baseValue, attacks, rateMap, total }
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
    public readonly powerModifier: number,
    public readonly typeFactor: number
  ) {
    DayCombatSpecialAttack.all.push(this)
  }

  get api() {
    return Math.floor(this.id)
  }

  get isCarrierSpecialAttack() {
    return this.api === 7
  }

  get modifier() {
    return { power: this.powerModifier }
  }
}
