type IShipStat = {
  left: number
  right: number
  equipment: number
  modernization: number

  naked: number
  value: number
}

class ShipStat implements IShipStat {
  constructor(
    public tag: string,
    public left: number,
    public right: number,
    public equipment: number,
    public level: number,
    public modernization = 0
  ) {}

  get naked() {
    const { tag, left, right, level, modernization } = this
    if (["asw", "evasion", "los"].includes(tag)) {
      const step = (right - left) / 99
      return left + Math.floor(step * level) + modernization
    }
    return right + modernization
  }

  get value() {
    return this.naked + this.equipment
  }
}
