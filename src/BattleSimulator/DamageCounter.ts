import { Health, IShip } from "../objects/ship"

export default class DamageCounter {
  public Less = 0
  public Shouha = 0
  public Chuuha = 0
  public Taiha = 0
  public Sunk = 0

  public get total() {
    return this.Less + this.Shouha + this.Chuuha + this.Taiha + this.Sunk
  }

  public get lessRate() {
    return this.Less / this.total
  }
  public get shouhaRate() {
    return this.Shouha / this.total
  }
  public get chuuhaRate() {
    return this.Chuuha / this.total
  }
  public get taihaRate() {
    return this.Taiha / this.total
  }
  public get sunkRate() {
    return this.Sunk / this.total
  }

  public increase = ({ health }: IShip) => {
    this[health.damage] += 1
  }
}
