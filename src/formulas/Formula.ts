import { Diff } from "utility-types"

type Formula<P extends object, R extends object> = (params: P) => R

const compose1 = <P1 extends object, R1 extends object, P2 extends object, R2 extends object>(
  f1: Formula<P1, R1>,
  f2: Formula<P2, R2>
) => (params: P1 & Diff<P2, R1>) => {
  const r1 = f1(params)
  const p2 = { ...params, ...r1 }
  return { ...f2(p2 as any), ...r1 }
}

function compose<P1 extends object, R1 extends object, P2 extends object, R2 extends object>(
  f1: Formula<P1, R1>,
  f2: Formula<P2, R2>
): Formula<P1 & Diff<P2, R1>, R1 & R2>
function compose<
  P1 extends object,
  R1 extends object,
  P2 extends object,
  R2 extends object,
  P3 extends object,
  R3 extends object
>(
  f1: Formula<P1, R1>,
  f2: Formula<P2, R2>,
  f3: Formula<P3, R3>
): Formula<P1 & Diff<P2, R1> & Diff<P3, R1 & R2>, R1 & R2 & R3>
function compose<
  P1 extends object,
  R1 extends object,
  P2 extends object,
  R2 extends object,
  P3 extends object,
  R3 extends object,
  P4 extends object,
  R4 extends object
>(
  f1: Formula<P1, R1>,
  f2: Formula<P2, R2>,
  f3: Formula<P3, R3>,
  f4: Formula<P4, R4>
): Formula<P1 & P2 & P3 & P4, R1 & R2 & R3 & R4>
function compose(...fs: Array<Formula<any, any>>) {
  return fs.reduce(compose1)
}

export { compose }

type EnumDefinition<K extends string, T> = { [Key in K]: T }

type Enum<K extends string, T> = {
  values: () => T[]
  keys: () => K[]
  entries: () => Array<[K, T]>
} & EnumDefinition<K, T>

const createEnum = <K extends string, T>(definition: EnumDefinition<K, T>): Enum<K, T> => {
  const values = () => Object.values(definition) as T[]
  const keys = () => Object.keys(definition) as K[]
  const entries = () => Object.entries(definition) as Array<[K, T]>
  return {
    ...definition,
    values,
    keys,
    entries
  }
}

const Type = createEnum({ Up: 0, Down: 1 })
Type.Up
