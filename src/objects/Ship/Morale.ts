export interface IMorale {
  value: number
  state: "Sparkling" | "Normal" | "Orange" | "Red"
  shellingAccuracyModifier: number
  nightBattleAccuracyModifier: number
  evasionModifier: number
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

  get shellingAccuracyModifier() {
    switch (this.state) {
      case "Sparkling":
        return 1.2
      case "Normal":
        return 1
      case "Orange":
        return 0.8
      case "Red":
        return 0.5
    }
    return 0
  }

  get nightBattleAccuracyModifier() {
    return this.shellingAccuracyModifier
  }

  get evasionModifier() {
    switch (this.state) {
      case "Sparkling":
        return 0.7
      case "Normal":
        return 1
      case "Orange":
        return 1.2
      case "Red":
        return 1.4
    }
    return 0
  }
}
