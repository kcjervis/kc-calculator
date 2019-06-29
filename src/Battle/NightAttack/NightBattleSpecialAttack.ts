import { IShip } from '../../objects'
import { Formation, Side } from '../../constants'

export const isNightAerialAttackShip = (ship: IShip) => {
  if (!ship.shipType.isAircraftCarrierClass) {
    return false
  }

  // Saratoga Mk.II | 赤城改二戊 | 夜間作戦航空要員
  const hasNoap = [545, 599].includes(ship.masterId) || ship.hasEquipment(equip => [258, 259].includes(equip.masterId))
  if (!hasNoap) {
    return false
  }

  return ship.planes.some(plane => plane.slotSize > 0 && plane.isNightPlane)
}

type NightContactState = {
  powerModifier: number
  accuracyModifier: number
  criticalHitRateModifier: number
}

export type SidedNightBattleState = {
  side: Side
  formation: Formation
  searchlight: boolean
  starshell: boolean
  contact?: NightContactState
}

const Lookout = 129

const calcPreModifierValue = (ship: IShip) => {
  const { nakedStats, level } = ship
  if (nakedStats.luck < 50) {
    return Math.floor(nakedStats.luck + 15 + 0.75 * Math.sqrt(level))
  }
  return Math.floor(Math.sqrt(nakedStats.luck - 50) + 65 + 0.8 * Math.sqrt(level))
}

const calcBaseValue = (
  ship: IShip,
  isFlagship: boolean,
  attackerSideState: SidedNightBattleState,
  defenderSideState: SidedNightBattleState
) => {
  let baseValue = calcPreModifierValue(ship)
  if (isFlagship) {
    baseValue += 15
  }
  if (ship.health.damage === 'Moderate') {
    baseValue += 18
  }
  if (ship.hasEquipment(Lookout)) {
    baseValue += 5
  }

  if (attackerSideState.searchlight) {
    baseValue += 7
  }
  if (defenderSideState.searchlight) {
    baseValue += -5
  }
  if (attackerSideState.starshell) {
    baseValue += 4
  }
  if (defenderSideState.starshell) {
    baseValue += -10
  }

  return baseValue
}

export default class NightBattleSpecialAttack {
  public static DoubleAttack = new NightBattleSpecialAttack(1, '連撃', 110, 1.2, 1.1)
  public static MainTorp = new NightBattleSpecialAttack(2, '主魚', 115, 1.3, 1.5)
  public static TorpTorp = new NightBattleSpecialAttack(3, '魚雷', 122, 1.5, 1.6)

  public static SubmarineTorpTorp = new NightBattleSpecialAttack(3.1, '潜水魚雷', 110, 1.65)
  public static SubmarineRadarTorp = new NightBattleSpecialAttack(3.2, '潜水電探', 102, 1.75)

  public static MainMainSecond = new NightBattleSpecialAttack(4, '主副', 130, 1.75, 1.65)
  public static MainMainMain = new NightBattleSpecialAttack(5, '主砲', 140, 2, 1.5)

  public static AerialAttack1 = new NightBattleSpecialAttack(6.1, '夜襲1.25', Infinity, 1.25)
  public static AerialAttack2 = new NightBattleSpecialAttack(6.2, '夜襲1.20', Infinity, 1.2)
  public static AerialAttack3 = new NightBattleSpecialAttack(6.3, '夜襲1.18', Infinity, 1.18)

  public static MainTorpRadar = new NightBattleSpecialAttack(7, '主魚電', 130, 1.3)
  public static TorpRadarLookout = new NightBattleSpecialAttack(8, '魚見電', 150, 1.2)

  public static getPossibleSpecialAttacks = (ship: IShip) => {
    const { shipType, hasEquipment, countEquipment } = ship
    const possibleSpecialAttacks = new Array<NightBattleSpecialAttack>()

    if (isNightAerialAttackShip(ship)) {
      const planes = ship.planes.filter(plane => plane.slotSize > 0)
      const nightFighterCount = planes.filter(plane => plane.isNightFighter).length
      const nightAttackerCount = planes.filter(plane => plane.isNightAttacker).length
      const nightPlaneCount = nightAttackerCount + nightAttackerCount
      const semiNightPlaneCount = planes.filter(plane => plane.isNightAircraft && !plane.isNightPlane).length

      const hasNightFighter = nightFighterCount >= 1
      const hasNightAttacker = nightAttackerCount >= 1
      const hasNightPlane = nightPlaneCount >= 1
      const hasFuzeBomber = planes.some(plane => plane.equipment.masterId === 320)

      if (nightFighterCount >= 2 && hasNightAttacker) {
        possibleSpecialAttacks.push(NightBattleSpecialAttack.AerialAttack1)
      }
      if ((hasNightFighter && hasNightAttacker) || (hasNightPlane && hasFuzeBomber)) {
        possibleSpecialAttacks.push(NightBattleSpecialAttack.AerialAttack2)
      }

      if (!hasNightFighter) {
        return possibleSpecialAttacks
      }
      if (nightFighterCount >= 3 || nightAttackerCount + semiNightPlaneCount >= 2) {
        possibleSpecialAttacks.push(NightBattleSpecialAttack.AerialAttack3)
      }

      return possibleSpecialAttacks
    }

    if (!ship.canNightAttack) {
      return possibleSpecialAttacks
    }

    const submarineTorpedoCount = countEquipment(equip => equip.category.is('SubmarineTorpedo'))
    const torpedoCount = countEquipment(equip => equip.category.is('Torpedo')) + submarineTorpedoCount

    // 駆逐カットイン
    if (shipType.is('Destroyer') && hasEquipment(equip => equip.isSurfaceRadar) && torpedoCount >= 1) {
      if (hasEquipment(equip => equip.category.is('SmallCaliberMainGun'))) {
        possibleSpecialAttacks.push(NightBattleSpecialAttack.MainTorpRadar)
      }
      if (hasEquipment(Lookout)) {
        possibleSpecialAttacks.push(NightBattleSpecialAttack.TorpRadarLookout)
      }
    }

    const mainGunCount = countEquipment(equip => equip.category.isMainGun)
    const secondaryGunCount = countEquipment(equip => equip.category.is('SecondaryGun'))

    // 潜水カットイン
    if (submarineTorpedoCount >= 1 && hasEquipment(equip => equip.category.is('SubmarineEquipment'))) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.SubmarineRadarTorp)
    } else if (submarineTorpedoCount >= 2) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.SubmarineTorpTorp)
    } else if (mainGunCount >= 3) {
      // 以降汎用カットイン
      possibleSpecialAttacks.push(NightBattleSpecialAttack.MainMainMain)
    } else if (mainGunCount >= 2 && secondaryGunCount >= 1) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.MainMainSecond)
    } else if (torpedoCount >= 2) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.TorpTorp)
    } else if (mainGunCount >= 1 && torpedoCount >= 1) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.MainTorp)
    } else if (mainGunCount + secondaryGunCount >= 2) {
      possibleSpecialAttacks.push(NightBattleSpecialAttack.DoubleAttack)
    }

    return possibleSpecialAttacks
  }

  public static calcPreModifierValue = calcPreModifierValue

  public static calcBaseValue = calcBaseValue

  public accuracyModifier: number

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly typeFactor: number,
    public readonly powerModifier: number,
    accuracyModifier?: number
  ) {
    this.accuracyModifier = accuracyModifier ? accuracyModifier : 1.1
  }

  get api() {
    return Math.floor(this.id)
  }

  get isDestroyerCutin() {
    return this.id === 7 || this.id === 8
  }

  public calcRate = (baseValue: number) => {
    if (this === NightBattleSpecialAttack.DoubleAttack) {
      return 109 / 110
    }
    return Math.ceil(baseValue) / this.typeFactor
  }
}
