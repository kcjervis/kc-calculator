import { IShip } from '../../objects'

const Lookout = 129

const getPossibleSpecialAttacks = (ship: IShip) => {
  const { shipType, hasEquipment, countEquipment, health } = ship
  const possibleSpecialAttacks = new Array<NightBattleSpecialAttack>()

  if (health.damage === 'Heavy') {
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
  playerSearchlight: boolean,
  enemySearchlight: boolean,
  playerStarshell: boolean,
  enemyStarshell: boolean
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
  if (playerSearchlight) {
    baseValue += 7
  }
  if (enemySearchlight) {
    baseValue += -5
  }
  if (playerStarshell) {
    baseValue += 4
  }
  if (enemyStarshell) {
    baseValue += -10
  }

  return baseValue
}

export default class NightBattleSpecialAttack {
  public static DoubleAttack = new NightBattleSpecialAttack(1, '連撃', 1.2)
  public static MainTorp = new NightBattleSpecialAttack(2, '主魚', 1.3, 115)
  public static TorpTorp = new NightBattleSpecialAttack(3, '魚雷', 1.5, 122)

  public static SubmarineTorpTorp = new NightBattleSpecialAttack(3, '潜水魚雷', 1.65, 110)
  public static SubmarineRadarTorp = new NightBattleSpecialAttack(3, '潜水電探', 1.75, 102)

  public static MainMainSecond = new NightBattleSpecialAttack(4, '主副', 1.75, 130)
  public static MainMainMain = new NightBattleSpecialAttack(5, '主砲', 2, 140)

  public static MainTorpRadar = new NightBattleSpecialAttack(7, '主魚電', 1.3, 130)
  public static TorpRadarLookout = new NightBattleSpecialAttack(8, '魚見電', 1.2, 150)

  public static getPossibleSpecialAttacks = getPossibleSpecialAttacks

  public static calcPreModifierValue = calcPreModifierValue

  public static calcBaseValue = calcBaseValue

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly powerModifier: number,
    public readonly typeFactor?: number
  ) {}
}
