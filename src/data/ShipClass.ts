import { ShipClassId, ShipClassJp as ShipClassData } from "@jervis/data"

const data = Object.entries(ShipClassData).filter((datum): datum is [string, number] => typeof datum[1] === "number")

export default class ShipClass {
  public static readonly all: ShipClass[] = data.map(datum => new ShipClass(...datum))

  public static fromId(id: number) {
    const found = ShipClass.all.find(shipClass => shipClass.id === id)
    if (found) {
      return found
    }
    const newShipClass = new ShipClass("unknown", id)
    ShipClass.all.push(newShipClass)
    return newShipClass
  }

  private constructor(public readonly name: string, public readonly id: number) {}

  public is = (key: keyof typeof ShipClassId) => {
    return this.id === ShipClassId[key]
  }

  public any = (...keys: Array<keyof typeof ShipClassId>) => {
    return keys.some(this.is)
  }

  /**
   * 特型駆逐艦
   */
  get isSpecialTypeDestroyer() {
    return this.any("FubukiClass", "AyanamiClass", "AkatsukiClass")
  }

  get isUsNavy() {
    return this.any(
      "JohnCButlerClass",
      "FletcherClass",
      "IowaClass",
      "LexingtonClass",
      "EssexClass",
      "CasablancaClass",
      "ColoradoClass"
    )
  }

  get isRoyalNavy() {
    return this.any("QueenElizabethClass", "NelsonClass", "ArkRoyalClass", "JClass")
  }
}
