import Proficiency, { getLevelBonusValue } from '../src/objects/Gear/Proficiency'

describe('Proficiency', () => {
  it('getLevelBonusValue', () => {
    const getCriticalModifierLevelBonus = (level: number) =>
      getLevelBonusValue(Proficiency.criticalModifierLevelBonuses, level)

    expect([0, 1, 2, 3, 4, 5, 6, 7].map(getCriticalModifierLevelBonus)).toEqual(
      expect.arrayContaining([0, 1, 2, 3, 4, 5, 7, 10])
    )
  })
})
