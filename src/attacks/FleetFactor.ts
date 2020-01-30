import { FleetType } from "../common"
import { Side, ShipInformation } from "../types"

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

const accuracyMatchers = [
  {
    fleetType: FleetType.CarrierTaskForce,
    factors: [78, 43]
  },
  {
    fleetType: FleetType.SurfaceTaskForce,
    factors: [70, 46]
  },
  {
    fleetType: FleetType.TransportEscort,
    factors: [51, 46]
  }
]

export type ShipFleetState = Pick<ShipInformation, "side" | "fleetType" | "role">

export const getShellingFleetFactor = (attacker: ShipFleetState, defender: ShipFleetState) => {
  // 通常vs通常
  if (!attacker.fleetType.isCombined && !defender.fleetType.isCombined) {
    return 0
  }

  const factorIndex = attacker.role === "Main" ? 0 : 1

  // 攻撃側[自軍]
  if (attacker.side === "Player") {
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

export const getTorpedoFleetFactor = (attacker: ShipFleetState, defender: ShipFleetState) => {
  const getFleetTypeBySide = (side: Side) => {
    return attacker.side === side ? attacker.fleetType : defender.fleetType
  }

  const playerFleetIsCombined = getFleetTypeBySide("Player").isCombined
  const enemyFleetIsCombined = getFleetTypeBySide("Enemy").isCombined

  const singleFleetFactor = 5
  if (!playerFleetIsCombined && !enemyFleetIsCombined) {
    return singleFleetFactor
  }
  if (playerFleetIsCombined && !enemyFleetIsCombined) {
    return singleFleetFactor - 5
  }
  return singleFleetFactor + 10
}

export const getShellingAccuracyFleetFactor = ({ fleetType, role }: ShipFleetState) => {
  const factorIndex = role === "Main" ? 0 : 1
  const factor = accuracyMatchers.find(matcher => matcher.fleetType === fleetType)?.factors[factorIndex]
  return factor ?? 90
}

export const getFleetFactors = (attacker: ShipFleetState, defender: ShipFleetState) => {
  const shelling = getShellingFleetFactor(attacker, defender)
  const shellingAccuracy = getShellingAccuracyFleetFactor(attacker)
  const torpedo = getTorpedoFleetFactor(attacker, defender)
  return { shelling, torpedo, shellingAccuracy }
}
