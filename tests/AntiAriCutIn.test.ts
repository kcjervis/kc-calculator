import AntiAirCutIn from '../src/data/AntiAirCutIn'

describe('AntiAirCutIn', () => {
  it('Aip1', () => {
    const aaci1 = AntiAirCutIn.fromApi(1)
    if (aaci1) {
      expect(aaci1.minimumBonus).toBe(8)
    }
  })
})
