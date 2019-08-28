export default class Range extends Number {
  public static from = (value: number) => new Range(value) as Range & number

  private constructor(public value: number) {
    super(value)
  }

  public get label() {
    const { value } = this
    switch (value) {
      case 0:
        return "無"
      case 1:
        return "短"
      case 2:
        return "中"
      case 3:
        return "長"
      case 4:
        return "超長"
    }
    if (value >= 5) {
      return `超長${value}`
    }
    return "不明"
  }
}
