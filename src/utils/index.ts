export const nonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null

export const merge = <T>(target: T, ...sources: Array<Partial<T>>) => {
  for (const source of sources) {
    for (const key in source) {
      const value = source[key]
      if (nonNullable(value)) {
        target[key] = value
      }
    }
  }
  return target
}

export const softcap = (cap: number, value: number) => (value <= cap ? value : cap + Math.sqrt(value - cap))

export const shipNameIsKai = (name: string) => /改$/.test(name)

export const shipNameIsKai2 = (name: string) => /(改二|Верный)(?!丙)/.test(name)
