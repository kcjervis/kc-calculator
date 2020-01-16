import Speed, { SpeedGroup } from "../common/Speed"

describe("getSpeedIncrement", () => {
  const fastA = {
    name: "FastA",
    group: SpeedGroup.FastA,
    tests: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2].map(num => num * 5)
  }
  const fastB1SlowA = {
    name: "FastB1SlowA",
    group: SpeedGroup.FastB1SlowA,
    tests: [1, 1, 1, 1, 1, 2, 3, 3, 2, 3, 3, 3, 3, 3].map(num => num * 5)
  }
  const fastB2SlowB = {
    name: "FastB2SlowB",
    group: SpeedGroup.FastB2SlowB,
    tests: [1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2].map(num => num * 5)
  }
  const otherC = {
    name: "OtherC",
    group: SpeedGroup.OtherC,
    tests: new Array<number>(14).fill(1).map(num => num * 5)
  }
  const testGroups = [fastA, fastB1SlowA, fastB2SlowB, otherC]

  let count = 0
  for (const newModelBoilerCount of [0, 1, 2, 3]) {
    for (const enhancedBoilerCount of [0, 1, 2, 3, 4]) {
      const totalBoilerCount = newModelBoilerCount + enhancedBoilerCount
      if (totalBoilerCount === 0 || totalBoilerCount > 4) {
        continue
      }

      for (const testGroup of testGroups) {
        const result = testGroup.tests[count]
        it(`name: ${testGroup.name}, enhancedBoiler: ${enhancedBoilerCount}, newModelBoiler: ${newModelBoilerCount}, toBe: ${result}`, () => {
          expect(Speed.getSpeedIncrement(testGroup.group, enhancedBoilerCount, newModelBoilerCount)).toBe(result)
        })
      }

      count++
    }
  }
})
