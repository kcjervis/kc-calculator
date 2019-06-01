import { Side, FleetType } from '../../constants'
import { ShipInformation } from '../../types'

const playerAttackMatchers = [
  {
    attackerFleetType: FleetType.CarrierTaskForce,
    defenderFleetType: FleetType.Single,
    factors: [2, 10]
  },
  {
    attackerFleetType: FleetType.SurfaceTaskForce,
    defenderFleetType: FleetType.Single,
    factors: [10, -5]
  },
  {
    attackerFleetType: FleetType.TransportEscort,
    defenderFleetType: FleetType.Single,
    factors: [-5, 10]
  },
  {
    attackerFleetType: FleetType.Single,
    defenderFleetType: FleetType.Combined,
    factors: [5, 5]
  },
  {
    attackerFleetType: FleetType.CarrierTaskForce,
    defenderFleetType: FleetType.Combined,
    factors: [2, -5]
  },
  {
    attackerFleetType: FleetType.SurfaceTaskForce,
    defenderFleetType: FleetType.Combined,
    factors: [2, -5]
  },
  {
    attackerFleetType: FleetType.TransportEscort,
    defenderFleetType: FleetType.Combined,
    factors: [-5, -5]
  }
]

const enemyAttackMatchers = [
  {
    attackerFleetType: FleetType.Single,
    defenderFleetType: FleetType.CarrierTaskForce,
    factors: [10, 5]
  },
  {
    attackerFleetType: FleetType.Single,
    defenderFleetType: FleetType.SurfaceTaskForce,
    factors: [5, -5]
  },
  {
    attackerFleetType: FleetType.Single,
    defenderFleetType: FleetType.TransportEscort,
    factors: [10, 5]
  }
]

type ShipFleetState = Pick<ShipInformation, 'side' | 'fleetType' | 'formation' | 'role'>

const getCombinedFleetFactor = (attacker: ShipFleetState, defender: ShipFleetState) => {
  // 通常vs通常
  if (!attacker.fleetType.isCombined && !defender.fleetType.isCombined) {
    return 0
  }

  const factorIndex = attacker.role === 'Main' ? 0 : 1

  // 攻撃側[自軍]
  if (attacker.side === Side.Player) {
    const found = playerAttackMatchers.find(
      matcher => matcher.attackerFleetType === attacker.fleetType && matcher.defenderFleetType === defender.fleetType
    )

    return found ? found.factors[factorIndex] : 0
  }

  // 攻撃側[敵軍] 連合艦隊
  if (attacker.fleetType.isCombined) {
    return [10, -5][factorIndex]
  }

  // 攻撃側[敵軍] 通常艦隊
  const found = enemyAttackMatchers.find(
    matcher => matcher.attackerFleetType === attacker.fleetType && matcher.defenderFleetType === defender.fleetType
  )
  return found ? found.factors[factorIndex] : 0
}

export default getCombinedFleetFactor
