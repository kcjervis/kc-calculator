/** 制空 */
export default class AirControlState<
  Name extends string = string,
  Constant extends number = number,
  Api extends number = number
> {
  public static readonly values = new Array<AirControlState<string, number, number>>()

  public static readonly AirSupremacy = new AirControlState('制空権確保', 1, 1)
  public static readonly AirSuperiority = new AirControlState('航空優勢', 3, 2)
  public static readonly AirParity = new AirControlState('制空均衡', 5, 0)
  public static readonly AirDenial = new AirControlState('航空劣勢', 7, 3)
  public static readonly AirIncapability = new AirControlState('制空権喪失', 10, 4)

  public static fromFighterPower(allied: number, enemy: number) {
    if (allied >= 3 * enemy) {
      return AirControlState.AirSupremacy
    } else if (allied >= 1.5 * enemy) {
      return AirControlState.AirSuperiority
    } else if (allied >= (2 / 3) * enemy) {
      return AirControlState.AirParity
    } else if (allied >= (1 / 3) * enemy) {
      return AirControlState.AirDenial
    } else {
      return AirControlState.AirIncapability
    }
  }

  public static fromApi(api: number) {
    return AirControlState.values.find(airState => airState.api === api)
  }

  private constructor(public readonly name: Name, public readonly constant: Constant, public readonly api: Api) {
    AirControlState.values.push(this)
  }
}
