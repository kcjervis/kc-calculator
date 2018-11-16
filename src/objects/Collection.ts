import maxBy from 'lodash/maxBy'
import some from 'lodash/some'
import sumBy from 'lodash/sumBy'

import { ListIterateeCustom, ValueIteratee } from 'lodash'

export type Iteratee<T> = ((value: T) => number) | string

// First Class Collection
export default class Collection<T> {
  constructor(public readonly list: T[]) {}

  public sumBy(iteratee: Iteratee<NonNullable<T>>) {
    return sumBy(this.nonNullableList(), iteratee)
  }

  public some(iteratee: ListIterateeCustom<NonNullable<T>, boolean>) {
    return some(this.nonNullableList(), iteratee)
  }

  public maxBy(iteratee: ValueIteratee<NonNullable<T>>) {
    return maxBy(this.nonNullableList(), iteratee)
  }

  public nonNullableList() {
    return this.list.filter((item: T): item is NonNullable<T> => item !== undefined && item !== null)
  }
}
