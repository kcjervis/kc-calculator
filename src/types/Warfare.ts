import { ShellingType } from "./ship"

export type Factors<T extends string> = { [K in T]: number }

export type DefensePower = {
  min: number
  max: number
  values: () => number[]
  random: () => number
}

export type WarfareModifiers = {
  power: number
  accuracy: number
  evasion: number
}

export type FormationModifiers = {
  fleetAntiAir: number
  shelling: WarfareModifiers
  torpedo: WarfareModifiers
  asw: WarfareModifiers
  nightBattle: WarfareModifiers
}

export type InstallationType = "None" | "SoftSkinned" | "Pillbox" | "SupplyDepot" | "IsolatedIsland"

export type AntiInstallationModifiers = {
  b12: number
  a13: number
  b13: number
  a13next: number
  b13next: number
}

export type ShellingBasicPowerFactors = {
  shellingType: ShellingType
  firepower: number
  bombing: number
  torpedo: number
  improvementModifier: number
  combinedFleetFactor: number
}

export type ShellingPowerPreCapModifiers = {
  formationModifier: number
  engagementModifier: number
  healthModifier: number
  cruiserFitBonus: number
  antiInstallationModifiers: AntiInstallationModifiers
}

export type ShellingPowerPostCapModifiers = {
  effectivenessMultiplicative: number
  effectivenessAdditive: number

  specialAttackModifier: number
  apShellModifier: number
  criticalModifier: number
  proficiencyModifier: number
  eventMapModifier: number
}

export type ShellingPowerFactors = ShellingBasicPowerFactors &
  ShellingPowerPreCapModifiers &
  ShellingPowerPostCapModifiers

export type ShellingPowerInformation = ShellingPowerFactors & {
  basicPower: number
  preCapPower: number
  cappedPower: number
  value: number
}

export type ShellingBasicAccuracyFactors = {
  combinedFleetFactor: number
  level: number
  luck: number
  equipmentAccuracy: number
  improvementModifier: number
}

export type ShellingAccuracyModifiers = {
  moraleModifier: number
  formationModifier: number
  fitGunBonus: number
  specialAttackModifier: number
  apShellModifier: number
}

export type ShellingAccuracyFactors = ShellingBasicAccuracyFactors & ShellingAccuracyModifiers

export type ShellingAccuracyInformation = ShellingAccuracyFactors & {
  basicAccuracy: number
  value: number
}

export type NightAttackType = "NightAttack" | "SwordfishAttack" | "NightAerialAttack"

export type NightAttackBasicPowerFactors = {
  nightAttackType: NightAttackType
  firepower: number
  torpedo: number
  improvementModifier: number
  nightAerialAttackPower: number
  nightContactModifier: number
}

export type NightAttackPowerPreCapModifiers = {
  formationModifier: number
  healthModifier: number
  specialAttackModifier: number
  cruiserFitBonus: number
  antiInstallationModifiers: AntiInstallationModifiers
}

export type NightAttackPowerPostCapModifiers = {
  effectivenessMultiplicative: number
  effectivenessAdditive: number
  criticalModifier: number
  proficiencyModifier: number
  eventMapModifier: number
}

export type NightAttackPowerFactors = NightAttackBasicPowerFactors &
  NightAttackPowerPreCapModifiers &
  NightAttackPowerPostCapModifiers
