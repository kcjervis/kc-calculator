export const calcStatAtLevel = ([at1, at99]: [number, number], level: number) =>
  Math.floor(((at99 - at1) * level) / 99 + at1)

export const calcHpAtLevel = ([unmarriedMax, limit]: [number, number], level: number) => {
  let maxHp = unmarriedMax
  if (level >= 100) {
    if (unmarriedMax >= 91) {
      maxHp += 9
    } else if (unmarriedMax >= 70) {
      maxHp += 8
    } else if (unmarriedMax >= 50) {
      maxHp += 7
    } else if (unmarriedMax >= 40) {
      maxHp += 6
    } else if (unmarriedMax >= 30) {
      maxHp += 5
    } else if (unmarriedMax >= 8) {
      maxHp += 4
    } else {
      maxHp += 3
    }
  }
  return Math.min(maxHp, limit)
}
