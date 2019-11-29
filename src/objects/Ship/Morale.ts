type MoraleState = "Sparkling" | "Normal" | "Orange" | "Red"

export type BattleType = "shelling" | "asw" | "torpedo" | "night"

export interface IMorale {
  value: number
  state: MoraleState

  getAccuracyModifier: (type: BattleType) => number
  evasionModifier: number
}

const CommonMoraleModifier = { Sparkling: 1.2, Normal: 1, Orange: 0.8, Red: 0.5 }
const MoraleModifierConfig = {
  accuracy: {
    shelling: CommonMoraleModifier,
    asw: CommonMoraleModifier,
    torpedo: { Sparkling: 1.3, Normal: 1, Orange: 0.7, Red: 0.35 },
    night: CommonMoraleModifier
  },
  evasion: { Sparkling: 0.7, Normal: 1, Orange: 1.2, Red: 1.4 }
}

export default class Morale implements IMorale {
  constructor(public value = 49) {}

  get state() {
    const { value } = this
    if (value >= 50) {
      return "Sparkling"
    } else if (value >= 30) {
      return "Normal"
    } else if (value >= 20) {
      return "Orange"
    }
    return "Red"
  }

  public getAccuracyModifier = (type: BattleType) => MoraleModifierConfig.accuracy[type][this.state]

  get evasionModifier() {
    return MoraleModifierConfig.evasion[this.state]
  }
}
