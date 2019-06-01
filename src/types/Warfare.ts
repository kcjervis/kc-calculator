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

export type ShellingType = 'Shelling' | 'CarrierShelling'

export type InstallationType = 'None' | 'SoftSkinned' | 'Pillbox' | 'SupplyDepot' | 'IsolatedIsland'

export type AntiInstallationModifiers = {
  shipTypeAdditive: number
  additive: number
  multiplicative: number
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
  antiSupplyDepotPostCapModifier: number
  specialMultiplicative: number

  specialAttackModifier: number
  apShellModifier: number
  criticalModifier: number
  proficiencyModifier: number
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

export type ShellingInformation = {
  power: ShellingPowerInformation
  accuracy: ShellingAccuracyInformation
}
