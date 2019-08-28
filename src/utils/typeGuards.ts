export const includes = <T, U>(array: readonly T[], searchElement: U): searchElement is U & T =>
  (array as Array<T | U>).includes(searchElement)
