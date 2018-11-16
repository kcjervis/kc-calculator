type ProficiencyJson =
  | {
      level: number
    }
  | {
      internal: number
    }

interface IEquipmentJson {
  masterId: number
  index: number
  improvement?: number
  proficiency?: ProficiencyJson
}

interface IShipJson {
  masterId: number
  index: number
  equipments: IEquipmentJson[]
  slots: number[]
}

interface IFleetJson {
  masterId: number
  index: number
  ships: IShipJson
}

interface IDeck {
  fleets: IFleetJson[]
}
