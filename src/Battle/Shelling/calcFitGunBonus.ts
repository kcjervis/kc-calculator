import { IShip, IGear } from '../../objects'

const nameIs = (name: string) => (gear: IGear) => gear.name === name

const calcFitGunBonus = (ship: IShip) => {
  let bonus = 0
  const marriageModifier = ship.level >= 100 ? 0.6 : 1

  const { shipClass, countGear } = ship
  const count51cmGroup = countGear(128) + countGear(281)
  const count46cm3Kai = countGear(276)
  const count46cm3 = countGear(9)
  const countPrototype46cm2 = countGear(117)
  const count41cm2Kai2 = countGear(318)
  const count41cmGroup = countGear(8) + countGear(105) + countGear(236) + countGear(290)
  const count16inchMk7Gfcs = countGear(183)
  const count16inchMk7 = countGear(161)
  const count16inchMk1FcrType284 = countGear(300)
  const count16inchMk1AfctKai = countGear(299)
  const count16inchMk1 = countGear(298)
  const count381mm50Group = countGear(133) + countGear(137)
  const count38cm4Group = countGear(245) + countGear(246)
  const count35_6cmGroup = countGear(gear => gear.name.includes('35.6cm')) + countGear(76) + countGear(114)
  const count38_1cmMk1Group = countGear(190) + countGear(192)
  const count30_5cm3Group = countGear(231) + countGear(232)

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
