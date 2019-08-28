import { calcHpAtLevel } from "../formulas"

enum DamageStatus {
  /** 無傷 */
  Normal,
  /** 小破 */
  Shouha,
  /** 中破 */
  Chuuha,
  /** 大破 */
  Taiha,
  /** 轟沈 */
  Sunk
}

export default class Health {
  public readonly tag = "hp"

  private inner = 0
  constructor(public max: number, current: number) {
    this.current = current
  }

  get current() {
    return this.inner
  }

  set current(next: number) {
    this.inner = Math.min(next, this.max)
  }
}
