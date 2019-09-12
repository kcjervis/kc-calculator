import { ObjectFactory } from "../../objects"

const kcObjectFactory = new ObjectFactory()
describe("ship", () => {
  it("createShip", () => {
    const ship = kcObjectFactory.createShip({ masterId: 1 })
    expect(ship).toBeTruthy()
    if (!ship) {
      return
    }

    expect(ship.level).toBe(1)
  })
})
