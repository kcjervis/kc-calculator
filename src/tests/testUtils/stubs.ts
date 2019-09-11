import { merge } from "../../utils"
import { GearStats } from "../../data/MasterGear"

export class StubbedGearStats implements GearStats {
  gearId = 0
  categoryId = 0
  iconId = 0
  name = ""

  hp = 0
  firepower = 0
  armor = 0
  torpedo = 0
  antiAir = 0
  speed = 0
  bombing = 0
  asw = 0
  los = 0
  luck = 0
  range = 0
  accuracy = 0
  evasion = 0
  antiBomber = 0
  interception = 0
  radius = 0

  improvable = false

  constructor(stats?: Partial<GearStats>) {
    if (stats) {
      merge(this, stats)
    }
  }
}
