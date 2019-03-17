/** 交戦形態 */
export default class EngagementForm<Name extends string = string, Id extends number = number> {
  public static readonly Parallel = new EngagementForm('同航戦', 1)
  public static readonly HeadOn = new EngagementForm('反航戦', 2)
  public static readonly CrossingTheTAdvantage = new EngagementForm('T字戦有利', 3)
  public static readonly CrossingTheTDisadvantage = new EngagementForm('T字戦不利', 4)

  private constructor(public readonly name: Name, public readonly id: Id) {}
}
