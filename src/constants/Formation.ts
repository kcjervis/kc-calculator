/** 陣形 */
export default class Formation<Name extends string = string, Id extends number = number> {
  public static all: Formation[] = []

  public static readonly LineAhead = new Formation('単縦陣', 1)
  public static readonly DoubleLine = new Formation('複縦陣', 2)
  public static readonly Diamond = new Formation('輪形陣', 3)
  public static readonly Echelon = new Formation('梯形陣', 4)
  public static readonly LineAbreast = new Formation('単横陣', 5)
  public static readonly Vanguard = new Formation('警戒陣', 6)

  public static readonly CruisingFormation1 = new Formation('第一警戒航行序列', 11)
  public static readonly CruisingFormation2 = new Formation('第二警戒航行序列', 12)
  public static readonly CruisingFormation3 = new Formation('第三警戒航行序列', 13)
  public static readonly CruisingFormation4 = new Formation('第四警戒航行序列', 14)

  public static fromId(id: number) {
    return Formation.all.find(form => form.id === id)
  }

  private constructor(public readonly name: Name, public readonly id: Id) {
    Formation.all.push(this)
  }

  get fleetAntiAirModifier() {
    switch (this) {
      case Formation.DoubleLine:
        return 1.2
      case Formation.Diamond:
        return 1.6
      case Formation.Vanguard:
      case Formation.CruisingFormation1:
        return 1.1
      case Formation.CruisingFormation3:
        return 1.5
    }
    return 1
  }

  get shellingPowerModifier() {
    switch (this) {
      case Formation.CruisingFormation4:
        return 1.1
      case Formation.DoubleLine:
      case Formation.CruisingFormation1:
        return 0.8
      case Formation.Diamond:
      case Formation.CruisingFormation3:
        return 0.7
      case Formation.Echelon:
        return 0.6
      case Formation.LineAbreast:
        return 0.6
    }
    return 1
  }

  get shellingAccuracyModifier() {
    switch (this) {
      case Formation.Diamond:
        return 1.1
      case Formation.Echelon:
        return 1.2
      case Formation.LineAbreast:
        return 1.3
    }
    return 1
  }

  get nightBattleAccuracyModifier() {
    switch (this) {
      case Formation.LineAhead:
        return 1
      case Formation.DoubleLine:
        return 0.9
      case Formation.Diamond:
        return 0.7
      case Formation.Echelon:
      case Formation.LineAbreast:
        return 0.8
    }
    return 1
  }
}
