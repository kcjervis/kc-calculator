import { shipNameIsKai, shipNameIsKai2 } from '../src/utils'

describe('utils', () => {
  it('shipNameIsKai', () => {
    expect(['Jervis改'].every(shipNameIsKai)).toBeTruthy()
    expect(['Jervis', '金剛改二', '朝潮改二丁'].every(shipNameIsKai)).toBeFalsy()
  })

  it('shipNameIsKai2', () => {
    expect(['金剛改二', '朝潮改二丁', 'Верный'].every(shipNameIsKai2)).toBeTruthy()
    expect(['Jervis', 'Jervis改'].every(shipNameIsKai2)).toBeFalsy()
  })
})
