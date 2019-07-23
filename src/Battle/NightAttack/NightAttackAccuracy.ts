import { merge } from '../../utils'

type NightAttackAccuracyFactors = {
  starshellModifier: number
  contactModifier: number

  level: number
  luck: number
  equipmentAccuracy: number
  improvementModifier: number

  formationModifier: number
  moraleModifier: number
  specialAttackModifier: number

  searchlightModifier: number
  fitGunBonus: number
}

export const calcNightAttackAccuracy = (factors: NightAttackAccuracyFactors) => {
  const {
    starshellModifier,
    contactModifier,

    level,
    luck,
    equipmentAccuracy,
    improvementModifier,

    formationModifier,
    moraleModifier,
    specialAttackModifier,

    searchlightModifier,
    fitGunBonus
  } = factors

  const base = Math.floor(
    (69 + starshellModifier) * contactModifier +
      2 * Math.sqrt(level) +
      1.5 * Math.sqrt(luck) +
      equipmentAccuracy +
      improvementModifier
  )

  return Math.floor(
    base * formationModifier * moraleModifier * specialAttackModifier + searchlightModifier + fitGunBonus
  )
}

export default class NightAttackAccuracy implements NightAttackAccuracyFactors {
  public starshellModifier = 0
  public contactModifier = 1

  public level = 0
  public luck = 0
  public equipmentAccuracy = 0
  public improvementModifier = 0

  public formationModifier = 1
  public moraleModifier = 1
  public specialAttackModifier = 1

  public searchlightModifier = 0
  public fitGunBonus = 0

  constructor(factors: Partial<NightAttackAccuracyFactors>) {
    merge(this, factors)
  }

  get value() {
    return calcNightAttackAccuracy(this)
  }
}
