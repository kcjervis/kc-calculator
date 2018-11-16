import StatsBonus, { StatsBonusCreator } from './StatsBonus'

const createBonus: StatsBonusCreator = ship => {
  // GFCS Mk.37
  const count = ship.countEquipment(307)
  if (count === 0) {
    return undefined
  }
  const { shipClass } = ship

  const isUSNavy =
    shipClass.equal('JohnCButlerClass') ||
    shipClass.equal('IowaClass') ||
    shipClass.equal('LexingtonClass') ||
    shipClass.equal('EssexClass') ||
    shipClass.equal('CasablancaClass')

  if (!isUSNavy) {
    return undefined
  }

  return new StatsBonus({
    multiplier: count,
    firepower: 1,
    antiAir: 1,
    evasion: 1
  })
}

export default createBonus
