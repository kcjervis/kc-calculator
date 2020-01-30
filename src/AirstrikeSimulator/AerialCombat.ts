import { IFleet, IShip, IPlane } from "../objects"
import { Side } from "../types"
import { Formation, AirControlState } from "../common"

import Contact from "./Contact"
import AirstrikeCombat from "./AirstrikeCombat"
import { sample } from "../utils"
import { ShipAntiAir, FleetAntiAir } from "../Battle/AerialCombat"

type PlaneParams = {
  slotSize: number
  fighterCombatResistModifier: number
}

type Params = PlaneParams & {
  airControlStateConstant: number
  side: Side
}

const getFighterCombatPlaneLoss = ({
  slotSize,
  airControlStateConstant,
  side,
  fighterCombatResistModifier
}: Params) => {
  let randomValue: number

  if (side === "Player") {
    const minNum = airControlStateConstant / 4
    const maxRandomValue = Math.floor((airControlStateConstant / 3) * 100)
    randomValue = Math.floor(Math.random() * (maxRandomValue + 1)) / 100 + minNum
  } else {
    const maxRandomValue = 11 - airControlStateConstant
    randomValue =
      0.35 * Math.floor(Math.random() * (maxRandomValue + 1)) + 0.65 * Math.floor(Math.random() * (maxRandomValue + 1))
  }

  const proportional = randomValue / 10

  return Math.floor(slotSize * proportional * fighterCombatResistModifier)
}

type AerialCombatParams = {
  playerFleet: IFleet
  enemyFleet: IFleet
  enemyFormation: Formation
}

const doFighterCombat = (playerFleet: IFleet, enemyFleet: IFleet) => {
  const airControlState = AirControlState.fromFighterPower(playerFleet.fighterPower, enemyFleet.fighterPower)

  const airControlStateConstant = airControlState.constant

  const participates = (plane: IPlane) => plane.is("DiveBomber") || plane.is("TorpedoBomber") || plane.is("Fighter")
  playerFleet.planes.filter(participates).forEach(plane => {
    const { slotSize } = plane

    const loss = getFighterCombatPlaneLoss({
      slotSize,
      airControlStateConstant,
      side: "Player",
      fighterCombatResistModifier: 1
    })

    plane.shotdown(loss)
  })

  return airControlState
}

const doAirDefence = ({ playerFleet, enemyFleet, enemyFormation }: AerialCombatParams) => {
  const attackers = playerFleet.planes.filter(AirstrikeCombat.isAirstrikePlane)

  const fleetAntiAir = FleetAntiAir.calcFleetAntiAir(enemyFleet, "Enemy", enemyFormation.fleetAntiAirModifier)

  attackers.forEach(plane => {
    const ship = sample(enemyFleet.nonNullableShips)
    const antiAir = new ShipAntiAir(ship, "Enemy", fleetAntiAir)

    const loss = antiAir.getShotdownNumber(plane)
    plane.shotdown(loss)
  })
}

export const doAerialCombat = (params: AerialCombatParams) => {
  const { playerFleet, enemyFleet, enemyFormation } = params

  // st1
  const airControlState = doFighterCombat(playerFleet, enemyFleet)

  const contactModifier = new Contact(playerFleet.planes).getContactModifier(airControlState)

  // st2
  doAirDefence(params)

  const airstrikeCombat = new AirstrikeCombat(playerFleet, enemyFleet, enemyFormation, contactModifier)
  airstrikeCombat.do()

  return airControlState
}
