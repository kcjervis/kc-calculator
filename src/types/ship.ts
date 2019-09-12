type AttackModifiers = { power: number; accuracy: number }

export type ShellingType = "Shelling" | "CarrierShelling"

export type ProficiencyModifiers = { power: number; hitRate: number; criticalRate: number }

export type ShipShellingStats = {
  shellingType: ShellingType

  firepower: number
  torpedo: number
  bombing: number

  cruiserFitBonus: number
  healthModifier: number

  fitGunAccuracyBonus: number

  level: number
  luck: number
  accuracy: number

  moraleModifier: number

  improvementModifiers: AttackModifiers
  apShellModifiers: AttackModifiers

  normalProficiencyModifiers: ProficiencyModifiers
  specialProficiencyModifiers: ProficiencyModifiers
}
