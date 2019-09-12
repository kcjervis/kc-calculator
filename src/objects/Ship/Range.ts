export default class Range {
  constructor(public naked: number, public equipment = 0, public bonus = 0) {}

  public get value() {
    const { naked, equipment, bonus } = this
    return Math.max(naked, equipment) + bonus
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
    return value >= 5 ? `超長${value}` : "不明"
  }
}
