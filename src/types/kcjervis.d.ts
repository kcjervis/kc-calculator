declare module 'types' {
  export type Predicate<Arg = any, Id = number> = Id | ((arg: Arg) => boolean)
}