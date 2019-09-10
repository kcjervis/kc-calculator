import { IGear, IShip } from "../../../objects"
import { GearId } from "@jervis/data"

export default (ship: IShip) => {
  enum MasterShipId {
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

  type GearIteratee = (gear: IGear) => boolean

  /** 高角砲 */
  const isHighAngleMount: GearIteratee = gear => gear.hasAttr("HighAngleMount")
  /** 特殊高角砲 */
  const isBuiltinHighAngleMount: GearIteratee = gear => isHighAngleMount(gear) && gear.antiAir >= 8
  /** 標準高角砲 */
  const isNormalHighAngleMount: GearIteratee = gear => isHighAngleMount(gear) && gear.antiAir < 8

  const isRadar: GearIteratee = gear => gear.category.isRadar
  /** 対空電探 */
  const isAARadar: GearIteratee = gear => isRadar(gear) && gear.antiAir >= 2

  const isAAGun: GearIteratee = gear => gear.category.is("AntiAircraftGun")

  /** 特殊機銃 */
  const isCDMG: GearIteratee = gear => isAAGun(gear) && gear.antiAir >= 9

  /** 標準機銃 */
  const isNormalAAGun: GearIteratee = gear => isAAGun(gear) && gear.antiAir >= 3 && gear.antiAir < 9

  const is12cm30tubeRocketLauncherKai2: GearIteratee = gear => gear.masterId === 274

  const is10cmTwinHighAngleMountKaiAMG: GearIteratee = gear => gear.masterId === 275

  const isAAShell: GearIteratee = gear => gear.category.is("AntiAircraftShell")

  /** 高射装置 */
  const isAAFD: GearIteratee = gear => gear.category.is("AntiAircraftFireDirector")

  const isLargeCaliberMainGun: GearIteratee = gear =>
    gear.category.either("LargeCaliberMainGun", "LargeCaliberMainGun2")

  const hasAtLeast = (callback: GearIteratee, count: number) => ship.countGear(callback) >= count
  const hasSome = (callback: GearIteratee) => ship.hasGear(callback)

  const possibleAntiAirCutinIds: number[] = []

  if (ship.shipClass.is("FletcherClass")) {
    const mk30Count = ship.countGear(GearId["5inch単装砲 Mk.30"]) + ship.countGear(GearId["5inch単装砲 Mk.30改"])
    const gfcsCount = ship.countGear(GearId["5inch単装砲 Mk.30改+GFCS Mk.37"])

    // 5inch単装砲 Mk.30改＋GFCS Mk.37 2本
    if (gfcsCount >= 2) {
      possibleAntiAirCutinIds.push(34)
    }
    // 5inch単装砲 Mk.30改＋GFCS Mk.37 & 5inch単装砲 Mk.30(改)
    if (gfcsCount > 0 && mk30Count > 0) {
      possibleAntiAirCutinIds.push(35)
    }

    // 5inch単装砲 Mk.30(改) 2本
    if (mk30Count >= 2) {
      // GFCS Mk.37
      if (ship.hasGear(GearId["GFCS Mk.37"])) {
        possibleAntiAirCutinIds.push(36)
      }
      possibleAntiAirCutinIds.push(37)
    }
  }

  // 秋月型 かつ 高角砲を装備
  if (ship.shipClass.is("AkizukiClass") && hasSome(isHighAngleMount)) {
    // 高角砲を2つ以上装備 かつ 電探を装備
    if (hasAtLeast(isHighAngleMount, 2) && hasSome(isRadar)) {
      possibleAntiAirCutinIds.push(1)
    }
    // 電探を装備
    if (hasSome(isRadar)) {
      possibleAntiAirCutinIds.push(2)
    }
    // 高角砲を2つ以上装備
    if (hasAtLeast(isHighAngleMount, 2)) {
      possibleAntiAirCutinIds.push(3)
    }
  } else {
    // 摩耶改二 かつ 高角砲を装備 かつ 特殊機銃を装備
    if (shipIs(MasterShipId.MayaKai2) && hasSome(isHighAngleMount) && hasSome(isCDMG)) {
      if (hasSome(isAARadar)) {
        possibleAntiAirCutinIds.push(10)
      }
      possibleAntiAirCutinIds.push(11)

      // 五十鈴改二 かつ 高角砲を装備 かつ 対空機銃を装備
    } else if (shipIs(MasterShipId.IsuzuKai2) && hasSome(isHighAngleMount) && hasSome(isAAGun)) {
      if (hasSome(isAARadar)) {
        possibleAntiAirCutinIds.push(14)
      }
      possibleAntiAirCutinIds.push(15)

      // 霞改二乙 かつ 高角砲を装備 かつ 対空機銃を装備
    } else if (shipIs(MasterShipId.KasumiKai2B) && hasSome(isHighAngleMount) && hasSome(isAAGun)) {
      if (hasSome(isAARadar)) {
        possibleAntiAirCutinIds.push(16)
      }
      possibleAntiAirCutinIds.push(17)

      // 鬼怒改二 かつ 特殊機銃を装備 かつ 標準高角砲を装備
    } else if (shipIs(MasterShipId.KinuKai2) && hasSome(isCDMG) && hasSome(isNormalHighAngleMount)) {
      possibleAntiAirCutinIds.push(19)

      // 由良改二 かつ 高角砲を装備 かつ 対空電探
    } else if (shipIs(MasterShipId.YuraKai2) && hasSome(isHighAngleMount) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(21)

      // 伊勢型航空戦艦 かつ 12㎝30連装噴進砲改二を装備 かつ 対空強化弾(三式弾)を装備 かつ 対空電探を装備
    } else if (
      ship.shipClass.is("IseClass") &&
      ship.shipType.is("AviationBattleship") &&
      hasSome(is12cm30tubeRocketLauncherKai2) &&
      hasSome(isAAShell) &&
      hasSome(isAARadar)
    ) {
      possibleAntiAirCutinIds.push(25)
    }

    // 高射装置を装備 かつ 大口径主砲を装備 かつ 対空強化弾(三式弾)を装備 かつ 対空電探を装備
    if (hasSome(isAAFD) && hasSome(isLargeCaliberMainGun) && hasSome(isAAShell) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(4)
    }

    // 特殊高角砲を2つ以上装備 かつ 対空電探を装備
    if (hasAtLeast(isBuiltinHighAngleMount, 2) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(5)
    }

    // 高射装置を装備 かつ 大口径主砲を装備 かつ 対空強化弾(三式弾)を装備
    if (hasSome(isAAFD) && hasSome(isLargeCaliberMainGun) && hasSome(isAAShell)) {
      possibleAntiAirCutinIds.push(6)
    }

    // 特殊高角砲を装備 かつ 対空電探を装備
    if (hasSome(isBuiltinHighAngleMount) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(8)
    }

    // 高射装置を装備かつ 高角砲を装備 かつ 対空電探を装備
    if (hasSome(isAAFD) && hasSome(isHighAngleMount) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(7)
    }

    // 武蔵改二 かつ 10cm連装高角砲改＋増設機銃を装備 かつ 対空電探を装備
    if (shipIs(MasterShipId.MusashiKai2) && hasSome(is10cmTwinHighAngleMountKaiAMG) && hasSome(isRadar)) {
      possibleAntiAirCutinIds.push(26)
    }

    // (伊勢型航空戦艦|武蔵改|武蔵改二) かつ 12㎝30連装噴進砲改二を装備 かつ 対空電探を装備
    if (
      (ship.shipClass.is("IseClass") && ship.shipType.is("AviationBattleship")) ||
      shipIs(MasterShipId.MusashiKai) ||
      shipIs(MasterShipId.MusashiKai2)
    ) {
      if (hasSome(is12cm30tubeRocketLauncherKai2) && hasSome(isAARadar)) {
        possibleAntiAirCutinIds.push(28)
      }
    }

    // (浜風乙改 または 磯風乙改) かつ 高角砲を装備 かつ 対空電探を装備
    if (shipIs(MasterShipId.IsokazeBKai) || shipIs(MasterShipId.HamakazeBKai)) {
      if (hasSome(isHighAngleMount) && hasSome(isAARadar)) {
        possibleAntiAirCutinIds.push(29)
      }
    }

    // 高射装置を装備 かつ 高角砲を装備
    if (hasSome(isAAFD) && hasSome(isHighAngleMount)) {
      possibleAntiAirCutinIds.push(9)
    }

    // Gotland改 かつ 高角砲を装備 かつ 対空4以上の対空機銃を装備
    if (
      ship.name === "Gotland改" &&
      ship.hasGear(isHighAngleMount) &&
      ship.hasGear(gear => gear.category.is("AntiAircraftGun") && gear.antiAir >= 4)
    ) {
      possibleAntiAirCutinIds.push(33)
    }

    // 特殊機銃を装備 かつ 対空電探を装備 かつ 標準機銃または特殊機銃を装備
    if (
      hasSome(isCDMG) &&
      hasSome(isAARadar) &&
      ship.countGear(gear => gear.category.is("AntiAircraftGun") && gear.antiAir >= 3) >= 2
    ) {
      possibleAntiAirCutinIds.push(12)
    }

    // 特殊高角砲を装備 かつ 特殊機銃を装備 かつ 対空電探を装備
    if (hasSome(isBuiltinHighAngleMount) && hasSome(isCDMG) && hasSome(isAARadar)) {
      possibleAntiAirCutinIds.push(13)
    }

    // 皐月改二 かつ 特殊機銃を装備
    if (shipIs(MasterShipId.SatsukiKai2) && hasSome(isCDMG)) {
      possibleAntiAirCutinIds.push(18)
    }

    // 鬼怒改二 かつ 特殊機銃を装備
    if (shipIs(MasterShipId.KinuKai2) && hasSome(isCDMG)) {
      possibleAntiAirCutinIds.push(20)
    }

    // 文月改二 かつ 特殊機銃を装備
    if (shipIs(MasterShipId.FumizukiKai2) && hasSome(isCDMG)) {
      possibleAntiAirCutinIds.push(22)
    }

    // (UIT-25 または 伊504) かつ 標準機銃を装備
    if (shipIs(MasterShipId.Uit25) || shipIs(MasterShipId.I504)) {
      if (hasSome(isNormalAAGun)) {
        possibleAntiAirCutinIds.push(23)
      }
    }

    // (龍田改二|天龍改二) かつ 高角砲を装備 かつ 標準機銃を装備
    if (["龍田改二", "天龍改二"].includes(ship.name) && hasSome(isHighAngleMount) && hasSome(isNormalAAGun)) {
      possibleAntiAirCutinIds.push(24)
    }

    // (天龍改二|Gotland改) かつ 高角砲を3つ以上装備
    if (["天龍改二", "Gotland改"].includes(ship.name) && ship.countGear(isHighAngleMount) >= 3) {
      possibleAntiAirCutinIds.push(30)
    }

    // 天龍改二 かつ 高角砲を2つ以上装備
    if (ship.name === "天龍改二" && ship.countGear(isHighAngleMount) >= 2) {
      possibleAntiAirCutinIds.push(31)
    }

    if (ship.shipClass.isRoyalNavy || (ship.shipClass.is("KongouClass") && ship.name.includes("改二"))) {
      if (
        ship.countGear(301) >= 2 ||
        (ship.hasGear(301) && ship.hasGear(191)) ||
        (ship.hasGear(300) && ship.hasGear(191))
      ) {
        possibleAntiAirCutinIds.push(32)
      }
    }
  }
  return possibleAntiAirCutinIds
}
