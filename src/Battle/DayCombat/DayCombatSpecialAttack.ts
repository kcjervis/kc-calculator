export default class DayCombatSpecialAttack {
  public static all: DayCombatSpecialAttack[] = []

  public static MainMain = new DayCombatSpecialAttack(6, '主主', 1.5, 150)
  public static MainApShell = new DayCombatSpecialAttack(5, '主徹', 1.3, 140)
  public static MainRader = new DayCombatSpecialAttack(4, '主電', 1.2, 130)
  public static MainSecond = new DayCombatSpecialAttack(3, '主副', 1.1, 120)
  public static DoubleAttack = new DayCombatSpecialAttack(2, '連撃', 1.2, 130)

  public static FighterBomberAttacker = new DayCombatSpecialAttack(7, 'FBA', 1.25, 125)
  public static BomberBomberAttacker = new DayCombatSpecialAttack(7, 'BBA', 1.2, 140)
  public static BomberAttacker = new DayCombatSpecialAttack(7, 'BA', 1.15, 155)

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly powerModifier: number,
    public readonly typeFactor: number
  ) {
    DayCombatSpecialAttack.all.push(this)
  }
}
