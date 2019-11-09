declare module "sift" {
  export type SupportedType = string | { [index: string]: RegExp | any } | number | null | any
  export type KeyOrValue<T extends SupportedType> = T

  export type ElemMatch<T> = { [P in keyof T]?: SiftQuery<T[P]> }

  export type Query<T extends SupportedType> = {
    $eq?: T
    $ne?: T
    $or?: Array<SiftQuery<T>>
    $gt?: T
    $gte?: T
    $lt?: T
    $lte?: T
    $mod?: number[]
    $in?: T[]
    $nin?: T[]
    $not?: SiftQuery<T>
    $type?: any
    $all?: T[]
    $size?: number
    $nor?: T[]
    $and?: Array<SiftQuery<T>>
    $regex?: RegExp | string
    $elemMatch?: ExternalQuery<T>
    $exists?: boolean
    $where?: string | WhereFn<T>
    $options?: "i" | "g" | "m" | "u"
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface InternalQuery<T extends SupportedType> extends Query<T> {}

  export type ExternalQuery<T extends SupportedType> = ElemMatch<T>

  export type WhereFn<T extends SupportedType> = (this: T, value: T, index: number, array: T) => boolean

  export type FilterFn = <T>(value: T, index?: number, array?: T[]) => boolean

  export type SiftQuery<T extends SupportedType> =
    | ExternalQuery<T>
    | InternalQuery<T>
    | (T extends Array<infer U> ? ExternalQuery<U> | InternalQuery<U> : never)

  export type PluginDefinition<T> = {
    [index: string]: (a: T, b: T) => boolean | number
  }

  export type PluginFunction<T> = (sift: Sift) => PluginDefinition<T>

  export type Exec = <T extends SupportedType>(array: T) => T

  type Options<T> = {
    expressions?: {
      [identifier: string]: (item: T, query: SiftQuery<T>, options: Options<T>) => boolean
    }
  }

  export interface Sift {
    <T extends SupportedType>(query: SiftQuery<T>, options?: Options<T>): FilterFn
    compare<T, K>(a: T, b: K): 0 | -1 | 1
  }
  const sift: Sift
  export default sift
}
