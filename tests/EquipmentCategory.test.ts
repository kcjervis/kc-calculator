import GearCategory from '../src/data/GearCategory'

describe('GearCategory', () => {
  it('SmallCaliberMainGun', () => {
    const category = GearCategory.fromId(1)
    expect(category.id).toBe(1)
    expect(category.name).toBe('小口径主砲')
    expect(category.is('SmallCaliberMainGun')).toBeTruthy()
    expect(category.is('Torpedo')).toBeFalsy()
  })
})
