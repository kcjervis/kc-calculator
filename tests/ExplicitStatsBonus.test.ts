import { statsBonusCreators } from '../src/objects/Ship/ExplicitStatsBonus'

describe('ExplicitStatsBonus', () => {
  it('statsBonusCreators', () => {
    statsBonusCreators.forEach(func => console.log(func.name))
  })
})
