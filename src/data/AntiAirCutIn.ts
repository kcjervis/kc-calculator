import { IEquipment } from '../objects'
import { IShip } from '../objects/Ship'
import EquipmentCategoryId from './EquipmentCategoryId'
import ShipClassId from './ShipClassId'

const data: Array<[number, number, number, number]> = [
  [1, 8, 1.7, 65],
  [2, 7, 1.7, 58],
  [3, 5, 1.6, 50],
  [4, 7, 1.5, 52],
  [5, 5, 1.5, 55],
  [6, 5, 1.45, 40],
  [7, 4, 1.35, 45],
  [8, 5, 1.4, 50],
  [9, 3, 1.3, 40],
  [10, 9, 1.65, 60],
  [11, 7, 1.5, 55],
  [12, 4, 1.25, 45],
  [13, 5, 1.35, 35],
  [14, 5, 1.45, 63],
  [15, 4, 1.3, 58],
  [16, 5, 1.4, 60],
  [17, 3, 1.25, 55],
  [18, 3, 1.2, 60],
  [19, 6, 1.45, 55],
  [20, 4, 1.25, 70],
  [21, 6, 1.45, 60],
  [22, 3, 1.2, 63],
  [23, 2, 1.05, 80],
  [24, 4, 1.25, 60],
  [25, 8, 1.55, 60],
  [26, 7, 1.4, 60],
  [28, 5, 1.4, 55],
  [29, 6, 1.55, 58]
]
/** 対空カットイン */
export default class AntiAirCutIn {
  public static readonly all = data.map(datum => new AntiAirCutIn(...datum))

  public static fromApi(api: number) {
    return this.all.find(aaci => aaci.api === api)
  }

  public static getPossibleAntiAirCutIns(ship: IShip) {
    const enum MasterShipId {
      MayaKai2 = 428,
      IsuzuKai2 = 141,
      KasumiKai2B = 470,
      KinuKai2 = 487,
      YuraKai2 = 488,
      MusashiKai = 148,
      MusashiKai2 = 546,
      IsokazeBKai = 557,
      HamakazeBKai = 558,
      SatsukiKai2 = 418,
      FumizukiKai2 = 548,
      Uit25 = 539,
      I504 = 530,
      TatsutaKai2 = 478
    }

    const shipIs = (masterId: MasterShipId) => ship.masterId === masterId
    const isIseClassKai = ship.shipClass.id === ShipClassId.IseClass && ship.masterId !== 77 && ship.masterId !== 87

    type EquipmentIteratee = (equip: IEquipment) => boolean

    /** 高角砲 */
    const isHighAngleMount: EquipmentIteratee = equip => equip.isHighAngleMount
    /** 特殊高角砲 */
    const isBuiltinHighAngleMount: EquipmentIteratee = equip => isHighAngleMount(equip) && equip.antiAir >= 8
    /** 標準高角砲 */
    const isNormalHighAngleMount: EquipmentIteratee = equip => isHighAngleMount(equip) && equip.antiAir < 8

    const isRadar: EquipmentIteratee = equip => equip.category.isRadar
    /** 対空電探 */
    const isAARadar: EquipmentIteratee = equip => isRadar(equip) && equip.antiAir >= 2

    const isAAGun: EquipmentIteratee = equip => equip.category.id === EquipmentCategoryId.AntiAircraftGun
    /** 特殊機銃 */
    const isCDMG: EquipmentIteratee = equip => isAAGun(equip) && equip.antiAir >= 9
    /** 標準機銃 */
    const isNormalAAGun: EquipmentIteratee = equip => isAAGun(equip) && equip.antiAir >= 3 && equip.antiAir < 9

    const is12cm30tubeRocketLauncherKai2: EquipmentIteratee = equip => equip.masterId === 274

    const is10cmTwinHighAngleMountKaiAMG: EquipmentIteratee = equip => equip.masterId === 275

    const isAAShell: EquipmentIteratee = equip => equip.category.id === EquipmentCategoryId.AntiAircraftShell

    /** 高射装置 */
    const isAAFD: EquipmentIteratee = equip => equip.category.id === EquipmentCategoryId.AntiAircraftFireDirector

    const isLargeCaliberMainGun: EquipmentIteratee = equip =>
      equip.category.id === EquipmentCategoryId.LargeCaliberMainGun

    const hasAtLeast = (callback: EquipmentIteratee, count: number) => ship.countEquipment(callback) >= count
    const hasSome = (callback: EquipmentIteratee) => ship.hasEquipment(callback)

    const possibleAntiAirCutInApis: number[] = []

    // 秋月型 かつ 高角砲を装備
    if (ship.shipClass.id === ShipClassId.AkizukiClass && hasSome(isHighAngleMount)) {
      // 高角砲を2つ以上装備 かつ 電探を装備
      if (hasAtLeast(isHighAngleMount, 2) && hasSome(isRadar)) {
        possibleAntiAirCutInApis.push(1)
      }
      // 電探を装備
      if (hasSome(isRadar)) {
        possibleAntiAirCutInApis.push(2)
      }
      // 高角砲を2つ以上装備
      if (hasAtLeast(isHighAngleMount, 2)) {
        possibleAntiAirCutInApis.push(3)
      }
    } else {
      // 摩耶改二 かつ 高角砲を装備 かつ 特殊機銃を装備
      if (shipIs(MasterShipId.MayaKai2) && hasSome(isHighAngleMount) && hasSome(isCDMG)) {
        if (hasSome(isAARadar)) {
          possibleAntiAirCutInApis.push(10)
        }
        possibleAntiAirCutInApis.push(11)

        // 五十鈴改二 かつ 高角砲を装備 かつ 対空機銃を装備
      } else if (shipIs(MasterShipId.IsuzuKai2) && hasSome(isHighAngleMount) && hasSome(isAAGun)) {
        if (hasSome(isAARadar)) {
          possibleAntiAirCutInApis.push(14)
        }
        possibleAntiAirCutInApis.push(15)

        // 霞改二乙 かつ 高角砲を装備 かつ 対空機銃を装備
      } else if (shipIs(MasterShipId.KasumiKai2B) && hasSome(isHighAngleMount) && hasSome(isAAGun)) {
        if (hasSome(isAARadar)) {
          possibleAntiAirCutInApis.push(16)
        }
        possibleAntiAirCutInApis.push(17)

        // 鬼怒改二 かつ 特殊機銃を装備 かつ 標準高角砲を装備
      } else if (shipIs(MasterShipId.KinuKai2) && hasSome(isCDMG) && hasSome(isNormalHighAngleMount)) {
        possibleAntiAirCutInApis.push(19)

        // 由良改二 かつ 高角砲を装備 かつ 対空電探
      } else if (shipIs(MasterShipId.YuraKai2) && hasSome(isHighAngleMount) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(21)

        // 伊勢型改 かつ 12㎝30連装噴進砲改二を装備 かつ 対空強化弾(三式弾)を装備 かつ 対空電探を装備
      } else if (isIseClassKai && hasSome(is12cm30tubeRocketLauncherKai2) && hasSome(isAAShell) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(25)
      }

      // 高射装置を装備 かつ 大口径主砲を装備 かつ 対空強化弾(三式弾)を装備 かつ 対空電探を装備
      if (hasSome(isAAFD) && hasSome(isLargeCaliberMainGun) && hasSome(isAAShell) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(4)
      }

      // 特殊高角砲を2つ以上装備 かつ 対空電探を装備
      if (hasAtLeast(isBuiltinHighAngleMount, 2) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(5)
      }

      // 高射装置を装備 かつ 大口径主砲を装備 かつ 対空強化弾(三式弾)を装備
      if (hasSome(isAAFD) && hasSome(isLargeCaliberMainGun) && hasSome(isAAShell)) {
        possibleAntiAirCutInApis.push(6)
      }

      // 高射装置を装備かつ 高角砲を装備 かつ 対空電探を装備
      if (hasSome(isAAFD) && hasSome(isHighAngleMount) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(7)
      }

      // 特殊高角砲を装備 かつ 対空電探を装備
      if (hasSome(isBuiltinHighAngleMount) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(8)
      }

      // 武蔵改二 かつ 10cm連装高角砲改＋増設機銃を装備 かつ 対空電探を装備
      if (shipIs(MasterShipId.MusashiKai2) && hasSome(is10cmTwinHighAngleMountKaiAMG) && hasSome(isRadar)) {
        possibleAntiAirCutInApis.push(26)
      }

      // (伊勢型改 または 武蔵改 または 武蔵改二) かつ 12㎝30連装噴進砲改二を装備 かつ 対空電探を装備
      if (isIseClassKai || shipIs(MasterShipId.MusashiKai) || shipIs(MasterShipId.MusashiKai2)) {
        if (hasSome(is12cm30tubeRocketLauncherKai2) && hasSome(isAARadar)) {
          possibleAntiAirCutInApis.push(28)
        }
      }

      // (浜風乙改 または 磯風乙改) かつ 高角砲を装備 かつ 対空電探を装備
      if (shipIs(MasterShipId.IsokazeBKai) || shipIs(MasterShipId.HamakazeBKai)) {
        if (hasSome(isHighAngleMount) && hasSome(isAARadar)) {
          possibleAntiAirCutInApis.push(29)
        }
      }

      // 高射装置を装備 かつ 高角砲を装備
      if (hasSome(isAAFD) && hasSome(isHighAngleMount)) {
        possibleAntiAirCutInApis.push(9)
      }

      // 特殊機銃を装備 かつ 標準機銃または特殊機銃を装備 かつ 対空電探を装備
      if (hasSome(isCDMG) && (hasSome(isNormalAAGun) || hasSome(isCDMG)) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(12)
      }

      // 特殊高角砲を装備 かつ 特殊機銃を装備 かつ 対空電探を装備
      if (hasSome(isBuiltinHighAngleMount) && hasSome(isCDMG) && hasSome(isAARadar)) {
        possibleAntiAirCutInApis.push(13)
      }

      // 皐月改二 かつ 特殊機銃を装備
      if (shipIs(MasterShipId.SatsukiKai2) && hasSome(isCDMG)) {
        possibleAntiAirCutInApis.push(18)
      }

      // 鬼怒改二 かつ 特殊機銃を装備
      if (shipIs(MasterShipId.KinuKai2) && hasSome(isCDMG)) {
        possibleAntiAirCutInApis.push(20)
      }

      // 文月改二 かつ 特殊機銃を装備
      if (shipIs(MasterShipId.FumizukiKai2) && hasSome(isCDMG)) {
        possibleAntiAirCutInApis.push(22)
      }

      // (UIT-25 または 伊504) かつ 標準機銃を装備
      if (shipIs(MasterShipId.Uit25) || shipIs(MasterShipId.I504)) {
        if (hasSome(isCDMG)) {
          possibleAntiAirCutInApis.push(23)
        }
      }

      // 龍田改二 かつ 高角砲を装備 かつ 標準機銃を装備
      if (shipIs(MasterShipId.TatsutaKai2) && hasSome(isHighAngleMount) && hasSome(isNormalAAGun)) {
        possibleAntiAirCutInApis.push(24)
      }
    }
    return possibleAntiAirCutInApis
      .map(api => AntiAirCutIn.fromApi(api))
      .filter((aaci): aaci is AntiAirCutIn => aaci !== undefined)
  }
  private constructor(
    public readonly api: number,
    /** 最低保証 */
    public readonly minimumBonus: number,
    /** 変動ボーナス */
    public readonly fixedAirDefenseModifier: number,
    /** 発動定数 */
    public readonly probability: number
  ) {}
}
