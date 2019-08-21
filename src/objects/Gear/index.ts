import { IGear, IGearStats } from './Gear'

export type GearStatKey = keyof IGearStats

const gearStatKeys: GearStatKey[] = [
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

export { IGear, gearStatKeys }
export { default as Proficiency, IProficiency } from './Proficiency'
export { default as Improvement, IImprovement } from './Improvement'
export { default as GearFactory, IGearDataObject } from './GearFactory'
