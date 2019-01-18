import Datastore from 'nedb'
import MasterData from '../src/data/MasterData'

const masterData = new MasterData()

const shipDatabase = new Datastore({
  filename: 'scripts/WhoCallsTheFleet-DB/db/ships.nedb'
})

shipDatabase.loadDatabase(console.error)

const findShip = (id: number) =>
  new Promise<any>((resolve, reject) =>
    shipDatabase.findOne({ id }, (err, ship: any) => {
      resolve(ship)
      reject(err)
    })
  )

describe('ships', () => {
  for (const masterShip of masterData.ships) {
    it(masterShip.name, async () => {
      const ship = await findShip(masterShip.id)
      if (!ship || !ship.stat || ship.stat.asw === -1) {
        return
      }
      expect(ship.stat.asw).toBe(masterShip.asw[0])
      expect(ship.stat.asw_max).toBe(masterShip.asw[1])
      expect(ship.stat.los).toBe(masterShip.los[0])
      expect(ship.stat.los_max).toBe(masterShip.los[1])
      expect(ship.stat.evasion).toBe(masterShip.evasion[0])
      expect(ship.stat.evasion_max).toBe(masterShip.evasion[1])
    })
  }
})
