/** 陣形 */
export default class Formation<Name extends string = string, Api extends number = number> {
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

  private constructor(public readonly name: Name, public readonly api: Api) {}

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
      default:
        return 1
    }
  }
}
