import Collection from '../src/objects/Collection'

describe('Collection', () => {
  it('number', () => {
    const objs = new Collection([{ val: 1 }, { val: 2 }, { val: 3 }, { num: 4 }, { num: 5 }, undefined, null])
    expect(objs.sumBy('val')).toBe(6)
    expect(objs.sumBy('num')).toBe(9)
  })
})
