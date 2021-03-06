import { IShip, IGear } from "./objects"
import { ShipId, GearId } from "@jervis/data"
import { isNonNullable } from "./utils"
import { sumBy } from "lodash-es"

const clamp = (value: number, lower: number, upper: number) => Math.min(Math.max(value, lower), upper)

const getBonus2 = (gears: IGear[]) => {
  const lcCount = gears.filter(gear => gear.gearId === GearId["大発動艇"]).length
  const tokuCount = gears.filter(gear => gear.gearId === GearId["特大発動艇"]).length

  if (tokuCount <= 2) {
    return tokuCount * 0.02
  }
  if (tokuCount === 3) {
    return [0.05, 0.05, 0.052, 0.054, 0.054][lcCount] ?? 0.054
  }
  return [0.054, 0.056, 0.058, 0.059, 0.06][lcCount] ?? 0.06
}

const isExpeditionGear = (gear: IGear) =>
  [GearId["大発動艇"], GearId["大発動艇(八九式中戦車&陸戦隊)"], GearId["特大発動艇"], GearId["特二式内火艇"]].includes(
    gear.gearId
  )

const toGearExpeditionBonus = (gear: IGear) => {
  switch (gear.gearId) {
    case GearId["大発動艇"]:
    case GearId["特大発動艇"]:
      return 0.05
    case GearId["大発動艇(八九式中戦車&陸戦隊)"]:
      return 0.02
    case GearId["特二式内火艇"]:
      return 0.01
  }
  return 0
}

export const calcExpeditionBonus = (ships: IShip[]) => {
  const gears = ships.flatMap(ship => ship.gears).filter(isNonNullable)
  const expeditionGears = gears.filter(isExpeditionGear)

  const kinuBonus = ships.some(ship => ship.shipId === ShipId["鬼怒改二"]) ? 0.05 : 0
  const bonus1 = Math.min(sumBy(gears, toGearExpeditionBonus) + kinuBonus, 0.2)

  const average = expeditionGears.length && sumBy(expeditionGears, gear => gear.star) / expeditionGears.length
  const averageStarBonus = 0.01 * bonus1 * average

  const bonus2 = getBonus2(gears)

  return bonus1 + averageStarBonus + bonus2
}
