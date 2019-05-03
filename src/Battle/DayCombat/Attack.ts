import { IShip, IPlane } from '../../objects'

type DayCombatAttackType = 'shelling' | 'asw' | 'carrierShelling'

const isCarrierShellingShip = (ship: IShip) => {
  if (
    !ship.hasEquipment(equip =>
      equip.category.either(
        'CarrierBasedDiveBomber',
        'CarrierBasedTorpedoBomber',
        'JetPoweredFighterBomber',
        'JetPoweredTorpedoBomber'
      )
    )
  ) {
    return false
  }
  return ship.shipType.isAircraftCarrierClass || ship.shipClass.is('RevisedKazahayaClass')
}

const isCarrierShellingPlane = (plane: IPlane) =>
  plane.slotSize > 0 &&
  plane.category.either(
    'CarrierBasedDiveBomber',
    'CarrierBasedTorpedoBomber',
    'JetPoweredFighterBomber',
    'JetPoweredTorpedoBomber'
  )
