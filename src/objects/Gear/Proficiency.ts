import { maxBy } from "lodash-es"

type LevelBonus = { level: number; value: number }

export const getLevelBonusValue = (bonuses: LevelBonus[], level: number) => {
  const maxBonus = maxBy(bonuses.filter(bonus => bonus.level <= level), "value")
  return maxBonus ? maxBonus.value : 0
}

export interface IProficiency {
  internal: number
  level: number

  fighterPowerBonus: number
  criticalPowerModifier: number
}

export type ProficiencyType = "Fighter" | "SeaplaneBomber" | "Other"

/** 熟練度 */
export default class Proficiency implements IProficiency {
  public static readonly internalBounds = [0, 10, 25, 40, 55, 70, 85, 100]

  public static readonly fighterPowerLevelBonuses = {
    fighter: [
      { level: 7, value: 22 },
      { level: 5, value: 14 },
      { level: 4, value: 9 },
      { level: 3, value: 5 },
      { level: 2, value: 2 },
      { level: 0, value: 0 }
    ],
    seaplaneBomber: [{ level: 7, value: 6 }, { level: 5, value: 3 }, { level: 2, value: 1 }, { level: 0, value: 0 }]
  }

  public static readonly criticalModifierLevelBonuses = [
    { level: 7, value: 10 },
    { level: 6, value: 7 },
    { level: 5, value: 5 },
    { level: 4, value: 4 },
    { level: 3, value: 3 },
    { level: 2, value: 2 },
    { level: 1, value: 1 },
    { level: 0, value: 0 }
  ]

  public static internalToLevel(internal: number) {
    return Proficiency.internalBounds.filter(bound => bound <= internal).length - 1
  }

  constructor(public internal = 0, private type: ProficiencyType) {}

  get level() {
    return Proficiency.internalToLevel(this.internal)
  }

  set level(value: number) {
    this.internal = Proficiency.internalBounds[value]
  }

  get fighterPowerBonus() {
    const { internal, level, type } = this
    if (internal <= 0) {
      return 0
    }

    let bonuses: LevelBonus[] = []

    if (type === "Fighter") {
      bonuses = Proficiency.fighterPowerLevelBonuses.fighter
    } else if (type === "SeaplaneBomber") {
      bonuses = Proficiency.fighterPowerLevelBonuses.seaplaneBomber
    }

    const levelBonus = getLevelBonusValue(bonuses, level)
    return levelBonus + Math.sqrt(internal / 10)
  }

  get criticalPowerModifier() {
    const { internal, level } = this

    const levelBonus = getLevelBonusValue(Proficiency.criticalModifierLevelBonuses, level)
    return Math.floor(Math.sqrt(internal) + levelBonus)
  }
}
