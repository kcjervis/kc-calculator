import { FunctionalModifier, createAttackPower, createHitRate } from "../formulas"
import { IShip } from "../objects"
import { AttackPowerModifierRecord } from "../data/SpecialEnemyModifier"

type TorpedoBasicPowerFactors = {
  torpedo: number
  fleetFactor: number
  improvementModifier: number
}
const calcBasicPower = ({ torpedo, improvementModifier, fleetFactor }: TorpedoBasicPowerFactors) => {
  return torpedo + improvementModifier + fleetFactor
}

export default class TorpedoAttackStatus {
  constructor(private ship: IShip) {}

  get improvementModifier() {
    return this.ship.totalEquipmentStats(gear => gear.improvement.torpedoPowerModifier)
  }

  public createPreCriticalPower = ({
    fleetFactor,
    modifiers
  }: {
    fleetFactor: number
    modifiers: AttackPowerModifierRecord
  }) => {
    const { ship, improvementModifier } = this
    const { torpedo } = ship.stats

    const basic = calcBasicPower({ torpedo, fleetFactor, improvementModifier })
    const cap = 150
    return createAttackPower({ basic, cap, modifiers })
  }

  public createPower = (params: { fleetFactor: number; modifiers: AttackPowerModifierRecord; isCritical: boolean }) => {
    const preCriticalPower = this.createPreCriticalPower(params)

    if (!params.isCritical) {
      return preCriticalPower
    }
    const postcap = Math.floor(preCriticalPower.postcap * 1.5)
    return { ...preCriticalPower, postcap }
  }
}
