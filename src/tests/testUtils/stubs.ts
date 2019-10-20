import { merge } from "../../utils"
import { GearStats } from "../../types"
import { IImprovement, IProficiency } from "../../objects/gear"
import { ShipBase } from "../../data/MasterShip"

const makeStubCreator = <T extends object>(defaultProps: T) => (props?: Partial<T>) => {
  if (props) {
    return merge({ ...defaultProps }, props)
  }
  return defaultProps
}

export const createStubbedShipBase = makeStubCreator<ShipBase>({
  shipId: 0,
  shipClassId: 0,

  sortId: 0,
  name: "",
  readingName: "",
  hp: [0, 0],
  armor: [0, 0],
  firepower: [0, 0],
  torpedo: [0, 0],
  antiAir: [0, 0],
  luck: [0, 0],
  asw: [0, 0],
  evasion: [0, 0],
  los: [0, 0],
  speed: 0,
  range: 0,
  fuel: 0,
  ammo: 0,
  slotCapacities: [],
  initialEquipment: [],
  equippable: { categories: [], expantionSlot: [] }
})

export const createStubbedGearStats = makeStubCreator<GearStats>({
  gearId: 0,
  categoryId: 0,
  iconId: 0,
  name: "",

  hp: 0,
  firepower: 0,
  armor: 0,
  torpedo: 0,
  antiAir: 0,
  speed: 0,
  bombing: 0,
  asw: 0,
  los: 0,
  luck: 0,
  range: 0,
  accuracy: 0,
  evasion: 0,
  antiBomber: 0,
  interception: 0,
  radius: 0,

  improvable: false
})

export const createStubbedImprovement = makeStubCreator<IImprovement>({
  value: 0,

  contactSelectionModifier: 0,

  fighterPowerModifier: 0,
  adjustedAntiAirModifier: 0,
  fleetAntiAirModifier: 0,

  shellingPowerModifier: 0,
  shellingAccuracyModifier: 0,

  nightAttackPowerModifier: 0,
  nightAttackAccuracyModifier: 0,

  effectiveLosModifier: 0,
  evasionModifier: 0,
  defensePowerModifier: 0
})

export const createStubbedProficiency = makeStubCreator<IProficiency>({
  internal: 0,
  level: 0,
  visible: false,

  fighterPowerBonus: 0,
  criticalPowerModifier: 0
})
