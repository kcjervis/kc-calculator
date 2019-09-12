/**
 * 徹甲弾補正
 */
export const getApShellModifiers = (params: {
  hasArmorPiercingShell: boolean
  hasMainGun: boolean
  hasSecondaryGun: boolean
  hasRader: boolean
}) => {
  const modifier = { power: 1, accuracy: 1 }

  const { hasArmorPiercingShell, hasMainGun, hasRader, hasSecondaryGun } = params

  if (!hasArmorPiercingShell || !hasMainGun) {
    return modifier
  }

  if (hasSecondaryGun && hasRader) {
    return { power: 1.15, accuracy: 1.3 }
  }
  if (hasSecondaryGun) {
    return { power: 1.15, accuracy: 1.2 }
  }
  if (hasRader) {
    return { power: 1.1, accuracy: 1.25 }
  }
  return { power: 1.08, accuracy: 1.1 }
}

/**
 * 巡洋艦砲フィット補正
 *
 * 軽巡軽量砲補正と伊重巡フィット砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#軽巡軽量砲補正
 * @see https://github.com/Nishisonic/UnexpectedDamage/blob/develop/攻撃力資料/キャップ前攻撃力.md#伊重巡フィット砲補正
 */
export const calcCruiserFitBonus = (params: {
  isLightCruiserClass: boolean
  singleGunCount: number
  twinGunCount: number
  isZaraClass: boolean
  zaraGunCount: number
}) => {
  const { isLightCruiserClass, isZaraClass, singleGunCount, twinGunCount, zaraGunCount } = params

  if (isLightCruiserClass) {
    return Math.sqrt(singleGunCount) + 2 * Math.sqrt(twinGunCount)
  }
  if (isZaraClass) {
    return Math.sqrt(zaraGunCount)
  }
  return 0
}
