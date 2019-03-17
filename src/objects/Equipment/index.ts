import { IEquipment, IEquipmentStats } from './Equipment'

export type EquipmentStatKey = keyof IEquipmentStats

const equipmentStatKeys: EquipmentStatKey[] = [
  'armor',
  'firepower',
  'torpedo',
  'speed',
  'bombing',
  'antiAir',
  'asw',
  'los',
  'accuracy',
  'evasion',
  'interception',
  'antiBomber',
  'range',
  'radius'
]

export { IEquipment, equipmentStatKeys }
export { default as Proficiency, IProficiency } from './Proficiency'
export { default as Improvement, IImprovement } from './Improvement'
export { default as EquipmentFactory, IEquipmentDataObject } from './EquipmentFactory'
