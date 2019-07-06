import { IShip, IEquipment } from '../../objects'

const nameIs = (name: string) => (gear: IEquipment) => gear.name === name

const calcFitGunBonus = (ship: IShip) => {
  let bonus = 0
  const marriageModifier = ship.level >= 100 ? 0.6 : 1

  const { shipClass, countEquipment } = ship
  const count51cmGroup = countEquipment(128) + countEquipment(281)
  const count46cm3Kai = countEquipment(276)
  const count46cm3 = countEquipment(9)
  const countPrototype46cm2 = countEquipment(117)
  const count41cm2Kai2 = countEquipment(318)
  const count41cmGroup = countEquipment(8) + countEquipment(105) + countEquipment(236) + countEquipment(290)
  const count16inchMk7Gfcs = countEquipment(183)
  const count16inchMk7 = countEquipment(161)
  const count16inchMk1FcrType284 = countEquipment(300)
  const count16inchMk1AfctKai = countEquipment(299)
  const count16inchMk1 = countEquipment(298)
  const count381mm50Group = countEquipment(133) + countEquipment(137)
  const count38cm4Group = countEquipment(245) + countEquipment(246)
  const count35_6cmGroup =
    countEquipment(equip => equip.name.includes('35.6cm')) + countEquipment(76) + countEquipment(114)
  const count38_1cmMk1Group = countEquipment(190) + countEquipment(192)
  const count30_5cm3Group = countEquipment(231) + countEquipment(232)

  if (shipClass.is('GangutClass')) {
    bonus += -18 * Math.sqrt(count46cm3)
    bonus += -7 * Math.sqrt(countPrototype46cm2)
    bonus += -10 * Math.sqrt(count41cmGroup)
    bonus += -3 * Math.sqrt(count16inchMk7)
    bonus += -8 * Math.sqrt(count16inchMk1)
    bonus += 1 * Math.sqrt(count381mm50Group)

    bonus *= marriageModifier

    bonus += 7 * Math.sqrt(count35_6cmGroup)
    bonus += 7 * Math.sqrt(count38_1cmMk1Group)
    bonus += 10 * Math.sqrt(count30_5cm3Group)
  }

  if (shipClass.is('KongouClass')) {
    bonus += -10 * Math.sqrt(count46cm3Kai)
    bonus += -10 * Math.sqrt(count46cm3)
    bonus += -7 * Math.sqrt(countPrototype46cm2)
    bonus += -5 * Math.sqrt(count41cmGroup)
    bonus += -6 * Math.sqrt(count16inchMk7Gfcs)
    bonus += -5 * Math.sqrt(count16inchMk7)
    bonus += -3 * Math.sqrt(count16inchMk1FcrType284)
  }

  return bonus
}
