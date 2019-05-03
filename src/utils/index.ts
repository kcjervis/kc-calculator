export const nonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null

export const softcap = (cap: number, value: number) => (value <= cap ? value : cap + Math.sqrt(value - cap))

export const shipNameIsKai = (name: string) => /改$/.test(name)

export const shipNameIsKai2 = (name: string) => /(改二|Верный)(?!丙)/.test(name)
