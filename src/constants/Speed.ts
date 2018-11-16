import { IBaseShip } from '../objects/Ship'

export const enum SpeedValue {
  Land = 0,
  Slow = 5,
  Fast = 10,
  FastPlus = 15,
  Fastest = 20
}

/**
 * 潜在艦速区分
 */
export const enum SpeedGroup {
  FastA,
  FastB1SlowA,
  FastB2SlowB,
  OtherC
}

/**
 * 速力
 */
export default class Speed<Value extends SpeedValue = SpeedValue, Name extends string = string> {
  public static readonly Land = new Speed(0, '陸上')
  public static readonly Slow = new Speed(5, '低速')
  public static readonly Fast = new Speed(10, '高速')
  public static readonly FastPlus = new Speed(15, '高速+')
  public static readonly Fastest = new Speed(20, '最速')

  public static fromNumber(value: SpeedValue): Speed {
    switch (value) {
      case SpeedValue.Land:
        return Speed.Land
      case SpeedValue.Slow:
        return Speed.Land
      case SpeedValue.Fast:
        return Speed.Fast
      case SpeedValue.FastPlus:
        return Speed.FastPlus
      case SpeedValue.Fastest:
        return Speed.Fastest
    }
  }

  /**
   * 艦速グループを取得
   * 参考 http://kancolle.wikia.com/wiki/Partials/Speed_system
   */
  public static getSpeedGroup(ship: IBaseShip) {
    const className = ship.shipClass.name
    const { shipType } = ship

    const isFastAV = ship.nakedStats.speed === SpeedValue.Fast && className === '水上機母艦'

    if (
      isFastAV ||
      shipType.isSubmarine ||
      ['加賀型', '夕張型', '特種船丙型', '工作艦', '改風早型'].includes(className)
    ) {
      return SpeedGroup.OtherC
    }

    if (['島風型', 'Ташкент級', '大鳳型', '翔鶴型', '利根型', '最上型'].includes(className)) {
      return SpeedGroup.FastA
    }

    if (['阿賀野型', '蒼龍型', '飛龍型', '金剛型', '大和型', 'Iowa級'].includes(className)) {
      return SpeedGroup.FastB1SlowA
    }
    // 天津風
    const isAmatsukaze = [181, 316].includes(ship.masterId)
    // 雲龍
    const isUnryuu = [404, 406].includes(ship.masterId)
    // 天城
    const isAmagi = [331, 429].includes(ship.masterId)
    // 長門改二
    const isNagatoKai2 = 541 === ship.masterId
    if (isAmatsukaze || isUnryuu || isAmagi || isNagatoKai2) {
      return SpeedGroup.FastB1SlowA
    }

    return SpeedGroup.FastB2SlowB
  }

  /**
   * 速度上昇値を取得
   * @param group 潜在艦速区分
   * @param enhancedBoilerCount 強化缶の数
   * @param newModelBoilerCount 新型缶の数
   */
  public static getSpeedIncrement(group: SpeedGroup, enhancedBoilerCount: number, newModelBoilerCount: number) {
    const totalBoilerCount = enhancedBoilerCount + newModelBoilerCount
    switch (group) {
      case SpeedGroup.FastA:
        if (newModelBoilerCount >= 1 || totalBoilerCount >= 2) {
          return 10
        }
        break
      case SpeedGroup.FastB1SlowA:
        if (newModelBoilerCount === 0) {
          break
        }
        if (totalBoilerCount >= 3) {
          return 15
        }
        if (totalBoilerCount >= 2) {
          return 10
        }
        break
      case SpeedGroup.FastB2SlowB:
        if (newModelBoilerCount >= 2 || totalBoilerCount >= 3) {
          return 10
        }
        break
    }
    if (totalBoilerCount >= 1) {
      return 5
    }
    return 0
  }

  private constructor(public readonly value: Value, public readonly name: Name) {}

  /**
   * 加速
   */
  public add(value: SpeedValue) {
    const addedValue = this.value + value
    if (addedValue > SpeedValue.Fastest) {
      return Speed.Fastest
    }
    return Speed.fromNumber(addedValue)
  }
}
