export const nonNullable = <T>(item: T): item is NonNullable<T> => item !== undefined && item !== null

export const softcap = (cap: number, value: number) => {
  if (value <= cap) {
    return value
  }
  return value + Math.sqrt(value - cap)
}
