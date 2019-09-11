export type TypeEq<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
export const assertType = <_T extends true>() => undefined

export * from "./stubs"
