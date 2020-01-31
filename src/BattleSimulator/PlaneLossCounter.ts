import { IPlane } from "../objects"

export default class PlaneLossCounter {
  private countMap = new Map<number, number>()

  private get total() {
    let total = 0

    this.countMap.forEach(count => {
      total += count
    })

    return total
  }

  public increase = ({ slotSize }: IPlane) => {
    const prev = this.countMap.get(slotSize) ?? 0
    this.countMap.set(slotSize, prev + 1)
  }

  public entries = () => {
    const { total, countMap } = this

    return Array.from(countMap.entries(), ([slotSize, count]) => {
      return [slotSize, count / total]
    })
  }
}
