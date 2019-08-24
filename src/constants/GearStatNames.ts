const GearStatNames = [
  "hp",
  "armor",
  "firepower",
  "torpedo",
  "speed",
  "bombing",
  "antiAir",
  "asw",
  "accuracy",
  "interception",
  "evasion",
  "antiBomber",
  "los",
  "luck",
  "range",
  "radius"
] as const

export type GearStatName = typeof GearStatNames[number]

export default GearStatNames
