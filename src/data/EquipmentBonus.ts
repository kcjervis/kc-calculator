import { mapValues } from "lodash-es"
import { GearId, ShipClassId, ShipId, RemodelGroup } from "@jervis/data"
import Ship, { ShipQuery, IShip } from "../objects/ship/ship"
import { GearQuery } from "../objects/gear/Gear"
import { ShipTypeId } from "."
import { GearCategoryId } from "./GearCategory"
import { Speed } from "../common"

export const shipStatKeys = [
  "firepower",
  "armor",
  "torpedo",
  "accuracy",
  "evasion",
  "antiAir",
  "asw",
  "speed",
  "los",
  "range",
  "speed",
  "effectiveLos"
] as const
export type StatsBonusRecord = Partial<Record<typeof shipStatKeys[number], number>>

export type StatBonusRuleBase = {
  multiple?: StatsBonusRecord
  count1?: StatsBonusRecord
  count2?: StatsBonusRecord
  count3?: StatsBonusRecord
  count4?: StatsBonusRecord
}

export type StatBonusRule = StatBonusRuleBase & {
  byShip?: ShipQuery
  minStar?: number
  countCap?: number
}

type EquipmentSynergyRule = {
  byGear: GearQuery
  rules?: StatBonusRule[]
} & StatBonusRule

export type EquipmentBonusRule = {
  byGear: GearQuery
  effectiveLosBonus?: boolean
  rules?: StatBonusRule[]
  synergies?: EquipmentSynergyRule[]
} & StatBonusRule

export const equipmentBonusRules: EquipmentBonusRule[] = [
  // 小口径主砲
  {
    byGear: { gearId: GearId["12.7cm連装砲A型改二"] },
    byShip: {
      shipClassId: { $in: [ShipClassId.FubukiClass, ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass] }
    },
    multiple: { firepower: 1 },

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        count1: { firepower: 3, torpedo: 1, evasion: 2 }
      },
      {
        byGear: {
          gearId: {
            $in: [GearId["61cm三連装魚雷"], GearId["61cm三連装(酸素)魚雷"], GearId["61cm三連装(酸素)魚雷後期型"]]
          }
        },
        count1: { firepower: 1, torpedo: 3 },
        count2: { firepower: 1, torpedo: 2 }
      },
      {
        byGear: { gearId: GearId["61cm三連装(酸素)魚雷後期型"] },
        count1: { torpedo: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲A型改三(戦時改修)+高射装置"] },
    byShip: {
      shipClassId: { $in: [ShipClassId.FubukiClass, ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass] }
    },
    multiple: { firepower: 2, antiAir: 2 },

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        count1: { firepower: 3, torpedo: 1, evasion: 2 }
      },
      {
        byGear: { attrs: "AirRadar" },
        count1: { antiAir: 6 }
      },
      {
        byGear: {
          gearId: {
            $in: [GearId["61cm三連装魚雷"], GearId["61cm三連装(酸素)魚雷"], GearId["61cm三連装(酸素)魚雷後期型"]]
          }
        },
        count1: { firepower: 1, torpedo: 3 },
        count2: { firepower: 1, torpedo: 2 }
      },
      {
        byGear: { gearId: GearId["61cm三連装(酸素)魚雷後期型"] },
        count1: { torpedo: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲B型改四(戦時改修)+高射装置"] },

    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: ShipId["敷波改二"],
        multiple: { firepower: 2, torpedo: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.HatsuharuClass },
        multiple: { firepower: 1, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["白露改二"] },
        multiple: { firepower: 2, evasion: 2 }
      },
      {
        byShip: { shipId: ShipId["時雨改二"] },
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["村雨改二"] },
        multiple: { firepower: 1, antiAir: 1, evasion: 2 }
      },
      {
        byShip: { shipId: ShipId["夕立改二"] },
        multiple: { firepower: 2, torpedo: 1, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["海風改二"], ShipId["江風改二"]] } },
        multiple: { firepower: 1, evasion: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.ShiratsuyuClass, attrs: { $not: "Kai2" } },
        multiple: { firepower: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        rules: [
          {
            byShip: {
              shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass, ShipClassId.HatsuharuClass] }
            },
            count1: { firepower: 1, torpedo: 2, evasion: 2 }
          },
          {
            byShip: { shipClassId: ShipClassId.ShiratsuyuClass },
            count1: { firepower: 1, torpedo: 3, evasion: 2 }
          }
        ]
      },
      {
        byGear: { attrs: "AirRadar" },
        rules: [
          {
            byShip: {
              shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass, ShipClassId.HatsuharuClass] }
            },
            count1: { antiAir: 5 }
          },
          {
            byShip: { shipClassId: ShipClassId.ShiratsuyuClass },
            count1: { antiAir: 6 }
          }
        ]
      },
      {
        byGear: { gearId: GearId["61cm三連装(酸素)魚雷後期型"] },
        byShip: {
          shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass, ShipClassId.HatsuharuClass] }
        },
        count1: { firepower: 1, torpedo: 3 }
      },
      {
        byGear: { gearId: GearId["61cm四連装(酸素)魚雷後期型"] },
        byShip: { shipClassId: ShipClassId.ShiratsuyuClass },
        count1: { firepower: 1, torpedo: 3 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲C型改二"] },
    byShip: {
      shipClassId: { $in: [ShipClassId.KagerouClass, ShipClassId.AsashioClass, ShipClassId.ShiratsuyuClass] }
    },
    multiple: { firepower: 1 },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.KagerouClass, attrs: "Kai2" },
        count1: { firepower: 1 },
        count2: { firepower: 2 }
      },
      {
        byShip: {
          shipId: { $in: [ShipId["雪風改"], ShipId["磯風乙改"], ShipId["時雨改二"]] }
        },
        multiple: { evasion: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        rules: [
          {
            byShip: { shipClassId: { $in: [ShipClassId.AsashioClass, ShipClassId.ShiratsuyuClass] } },
            count1: { firepower: 1, torpedo: 3, evasion: 1 }
          },
          {
            byShip: { shipClassId: ShipClassId.KagerouClass },
            count1: { firepower: 2, torpedo: 3, evasion: 1 }
          }
        ]
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲D型改二"] },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: "Kai2" },
        multiple: { firepower: 3, evasion: 1 }
      },
      {
        byShip: {
          shipClassId: { $in: [ShipClassId.YuugumoClass, ShipClassId.ShimakazeClass] },
          attrs: { $not: "Kai2" }
        },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KagerouClass },
        multiple: { firepower: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KagerouClass, attrs: "Kai2" },
        count1: { firepower: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        rules: [
          {
            byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: "Kai2" },
            count1: { firepower: 3, torpedo: 4, evasion: 3 }
          },
          {
            byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: { $not: "Kai2" } },
            count1: { firepower: 2, torpedo: 3, evasion: 1 }
          },
          {
            byShip: { shipId: ShipId["島風改"] },
            count1: { firepower: 1, torpedo: 3, evasion: 2 }
          }
        ]
      }
    ]
  },

  {
    byGear: GearId["12.7cm連装砲D型改三"],

    rules: [
      {
        byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: "Kai2" },
        multiple: { firepower: 3, antiAir: 3, evasion: 1 }
      },
      {
        byShip: ShipId["沖波改二"],
        multiple: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: { $not: "Kai2" } },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: ShipId["島風改"],
        multiple: { firepower: 2, antiAir: 3, evasion: 1 }
      },
      {
        byShip: ShipId["島風"],
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KagerouClass, attrs: "Kai2" },
        multiple: { firepower: 2, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuugumoClass, attrs: { $not: "Kai2" } },
        multiple: { firepower: 1, evasion: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        byShip: { $or: [{ shipClassId: ShipClassId.YuugumoClass, attrs: "Kai2" }, { shipId: ShipId["島風改"] }] },
        count1: { firepower: 2, torpedo: 4, evasion: 2 }
      },
      {
        byGear: { attrs: "AirRadar" },
        byShip: { $or: [{ shipClassId: ShipClassId.YuugumoClass, attrs: "Kai2" }, { shipId: ShipId["島風改"] }] },
        count1: { firepower: 1, antiAir: 5, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["12cm単装砲改二"],

    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.KamikazeClass, ShipClassId.MutsukiClass] } },
        multiple: { firepower: 2, antiAir: 1, evasion: 3 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.ShimushuClass, ShipClassId.EtorofuClass] } },
        multiple: { firepower: 1, antiAir: 1, evasion: 2 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        rules: [
          {
            byShip: { shipClassId: { $in: [ShipClassId.KamikazeClass, ShipClassId.MutsukiClass] } },
            count1: { firepower: 2, torpedo: 1, evasion: 3 }
          },
          {
            byShip: { shipClassId: { $in: [ShipClassId.ShimushuClass, ShipClassId.EtorofuClass] } },
            count1: { firepower: 2, evasion: 3, asw: 1 }
          }
        ]
      },
      {
        byGear: { gearId: GearId["53cm連装魚雷"] },
        byShip: { shipClassId: { $in: [ShipClassId.KamikazeClass, ShipClassId.MutsukiClass] } },
        count1: { firepower: 2, torpedo: 4 },
        count2: { firepower: 1, torpedo: 3 }
      }
    ]
  },

  {
    byGear: GearId["12.7cm単装高角砲(後期型)"],
    byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
    multiple: { firepower: 1, antiAir: 1 },
    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        count1: { firepower: 1, evasion: 1 }
      },
      {
        byGear: { attrs: "AirRadar" },
        count1: { antiAir: 2, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["12.7cm単装高角砲(後期型)"],
    minStar: 7,

    rules: [
      {
        byShip: {
          $or: [
            { shipClassId: { $in: [ShipClassId.KamikazeClass, ShipClassId.MutsukiClass] } },
            { shipTypeId: ShipTypeId.CoastalDefenseShip }
          ]
        },
        multiple: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: { shipId: ShipId["由良改二"] },
        multiple: { firepower: 2, antiAir: 3 }
      },
      {
        byShip: { shipId: ShipId["鬼怒改二"] },
        multiple: { firepower: 2, antiAir: 2 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        rules: [
          {
            byShip: { shipClassId: { $in: [ShipClassId.KamikazeClass, ShipClassId.MutsukiClass] } },
            count1: { firepower: 2, evasion: 3 }
          },
          {
            byShip: { shipTypeId: ShipTypeId.CoastalDefenseShip },
            count1: { firepower: 1, evasion: 4 }
          },
          {
            byShip: { shipId: { $in: [ShipId["由良改二"], ShipId["鬼怒改二"]] } },
            count1: { firepower: 3, evasion: 2 }
          }
        ]
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲A型"] },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.FubukiClass },
        multiple: { evasion: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass] } },
        multiple: { evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["12.7cm連装砲B型改二"] },

    rules: [
      {
        byShip: {
          shipClassId: { $in: [ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass, ShipClassId.HatsuharuClass] }
        },
        multiple: { antiAir: 1 }
      },
      {
        byShip: ShipId["敷波改二"],
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["白露改"], ShipId["白露改二"], ShipId["村雨改二"]] } },
        multiple: { evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["時雨改二"] },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipId: ShipId["夕立改二"] },
        multiple: { firepower: 1, torpedo: 1, antiAir: 1, evasion: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["江風改二"], ShipId["海風改二"]] } },
        multiple: { evasion: 2 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["5inch単装砲 Mk.30改"] },
    byShip: { attrs: "UsNavy", shipTypeId: ShipTypeId.Destroyer },
    multiple: { firepower: 2, antiAir: 2, evasion: 1, armor: 1 }
  },

  {
    byGear: { gearId: GearId["5inch単装砲 Mk.30改+GFCS Mk.37"] },
    rules: [
      {
        byShip: { attrs: "UsNavy" },
        multiple: { firepower: 1, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipTypeId: ShipTypeId.Destroyer },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipTypeId: ShipTypeId.CoastalDefenseShip },
        multiple: { antiAir: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["130mm B-13連装砲"] },
    byShip: {
      $or: [
        { shipClassId: { $in: [ShipClassId.TashkentClass, ShipClassId.YuubariClass] } },
        { shipId: ShipId["Верный"] }
      ]
    },
    multiple: { firepower: 2, armor: 1 }
  },

  // 中口径主砲
  {
    byGear: { gearId: GearId["20.3cm(2号)連装砲"] },

    rules: [
      {
        byShip: { shipId: { $in: [ShipId["古鷹改二"], ShipId["加古改二"], ShipId["衣笠改"]] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: ShipId["青葉改"],
        multiple: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: ShipId["衣笠改二"],
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: {
          shipClassId: {
            $in: [
              ShipClassId.FurutakaClass,
              ShipClassId.TakaoClass,
              ShipClassId.AobaClass,
              ShipClassId.MyoukouClass,
              ShipClassId.MogamiClass,
              ShipClassId.ToneClass
            ]
          }
        },
        count1: { firepower: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        byShip: { shipClassId: { $in: [ShipClassId.FurutakaClass, ShipClassId.AobaClass] } },
        count1: { firepower: 3, torpedo: 2, evasion: 2 }
      },
      {
        byGear: { attrs: "AirRadar" },
        byShip: { shipId: { $in: [ShipId["青葉"], ShipId["青葉改"]] } },
        count1: { antiAir: 5, evasion: 2 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["Bofors 15.2cm連装砲 Model 1930"] },

    rules: [
      {
        byShip: {
          shipClassId: {
            $in: [ShipClassId.KumaClass, ShipClassId.NagaraClass, ShipClassId.SendaiClass, ShipClassId.AganoClass]
          }
        },
        multiple: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.GotlandClass },
        multiple: { firepower: 1, antiAir: 2, evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["14cm連装砲"] },

    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.YuubariClass, ShipClassId.KatoriClass] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.NisshinClass },
        multiple: { firepower: 2, torpedo: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["14cm連装砲改"] },

    rules: [
      {
        byShip: { shipId: { $in: [ShipId["夕張"], ShipId["夕張改"]] } },
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
        multiple: { firepower: 4, antiAir: 1, evasion: 2, asw: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
        minStar: 8,
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KatoriClass },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.NisshinClass },
        multiple: { firepower: 3, torpedo: 2, antiAir: 1, evasion: 1 }
      }
    ],

    synergies: [
      {
        byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
        byGear: { attrs: "SurfaceRadar" },
        count1: { firepower: 3, torpedo: 2, evasion: 2 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["152mm/55 三連装速射砲"] },
    byShip: { shipClassId: ShipClassId.DucaDegliAbruzziClass },
    multiple: { firepower: 1, antiAir: 1, evasion: 1 }
  },

  {
    byGear: { gearId: GearId["152mm/55 三連装速射砲改"] },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.DucaDegliAbruzziClass },
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.GotlandClass },
        multiple: { firepower: 1, antiAir: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: { $in: [GearId["8inch三連装砲 Mk.9"], GearId["8inch三連装砲 Mk.9 mod.2"]] } },
    rules: [
      {
        byShip: { shipClassId: ShipClassId.NorthamptonClass },
        multiple: { firepower: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.MogamiClass },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["6inch 連装速射砲 Mk.XXI"],
    rules: [
      {
        byShip: { shipClassId: ShipClassId.PerthClass },
        multiple: { firepower: 2, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["夕張"], ShipId["夕張改"]] } },
        multiple: { firepower: 1, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
        multiple: { firepower: 2, antiAir: 2, evasion: 1 }
      }
    ]
  },

  {
    byGear: {
      gearId: {
        $in: [
          GearId["Bofors 15cm連装速射砲 Mk.9 Model 1938"],
          GearId["Bofors 15cm連装速射砲 Mk.9改+単装速射砲 Mk.10改 Model 1938"]
        ]
      }
    },
    rules: [
      {
        byShip: { shipClassId: ShipClassId.DeRuyterClass },
        multiple: { firepower: 2, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.GotlandClass },
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.AganoClass },
        multiple: { firepower: 1, antiAir: 1 }
      }
    ]
  },

  {
    byGear: { gearId: { $in: [GearId["5inch連装両用砲(集中配備)"], GearId["GFCS Mk.37+5inch連装両用砲(集中配備)"]] } },
    rules: [
      {
        byShip: { shipClassId: ShipClassId.AtlantaClass },
        multiple: { firepower: 1, antiAir: 3, evasion: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.ColoradoClass, ShipClassId.NorthamptonClass] } },
        multiple: { antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.OoyodoClass, ShipClassId.AganoClass, ShipClassId.DeRuyterClass] } },
        multiple: { antiAir: -1, evasion: -2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.GotlandClass, ShipClassId.KatoriClass] } },
        multiple: { firepower: -2, antiAir: -1, evasion: -4 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.KumaClass, ShipClassId.NagaraClass, ShipClassId.SendaiClass] } },
        multiple: { firepower: -3, antiAir: -2, evasion: -6 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.TenryuuClass, ShipClassId.YuubariClass] } },
        multiple: { firepower: -3, antiAir: -3, evasion: -8 }
      }
    ]
  },

  // 大口径
  {
    byGear: { gearId: GearId["35.6cm三連装砲改(ダズル迷彩仕様)"] },

    rules: [
      {
        byShip: { shipId: ShipId["金剛改二"] },
        multiple: { firepower: 2, antiAir: 1 }
      },
      {
        byShip: { shipId: ShipId["榛名改二"] },
        multiple: { firepower: 2, antiAir: 2, evasion: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["比叡改二"], ShipId["霧島改二"]] } },
        multiple: { firepower: 1 }
      }
    ],

    synergies: [
      {
        byGear: { attrs: "SurfaceRadar" },
        byShip: { shipId: { $in: [ShipId["金剛改二"], ShipId["榛名改二"]] } },
        count1: { firepower: 2, evasion: 2 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["41cm三連装砲改二"] },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.FusouClass, attrs: "Kai2" },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["伊勢改"], ShipId["日向改"]] } },
        multiple: { firepower: 2, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["伊勢改二"] },
        multiple: { firepower: 3, antiAir: 2, evasion: 1, accuracy: 3 }
      },
      {
        byShip: { shipId: ShipId["日向改二"] },
        multiple: { firepower: 3, antiAir: 2, evasion: 2, accuracy: 3 }
      }
    ],

    synergies: [
      {
        byGear: { gearId: GearId["41cm連装砲改二"] },
        rules: [
          {
            byShip: { shipClassId: ShipClassId.NagatoClass, attrs: "Kai2" },
            count1: { firepower: 2, evasion: 2, armor: 1, accuracy: 1 }
          },
          {
            byShip: { shipClassId: ShipClassId.IseClass, shipTypeId: ShipTypeId.AviationBattleship },
            count1: { evasion: 2, armor: 1 }
          },
          {
            byShip: { shipId: ShipId["日向改二"] },
            count1: { firepower: 1, accuracy: 1 }
          }
        ]
      }
    ]
  },

  {
    byGear: { gearId: GearId["41cm連装砲改二"] },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.NagatoClass, attrs: "Kai2" },
        multiple: { firepower: 3, antiAir: 2, evasion: 1, accuracy: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
        multiple: { accuracy: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.IseClass, shipTypeId: ShipTypeId.AviationBattleship },
        multiple: { firepower: 2, antiAir: 2, evasion: 2 }
      },
      {
        byShip: { shipId: ShipId["日向改二"] },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.FusouClass, attrs: "Kai2" },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: { gearId: { $in: [GearId["41cm三連装砲改二"], GearId["41cm連装砲改二"]] } },

    synergies: [
      {
        byGear: { attrs: "AirRadar" },
        byShip: { shipClassId: ShipClassId.IseClass, shipTypeId: ShipTypeId.AviationBattleship },
        count1: { antiAir: 2, evasion: 3, accuracy: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["35.6cm連装砲(ダズル迷彩)"] },
    rules: [
      {
        byShip: { shipId: ShipId["金剛改二"] },
        multiple: { firepower: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["比叡改二"], ShipId["霧島改二"]] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipId: ShipId["榛名改二"] },
        multiple: { firepower: 2, antiAir: 1, evasion: 2 }
      }
    ]
  },

  {
    byGear: {
      gearId: {
        $in: [
          GearId["16inch Mk.I三連装砲"],
          GearId["16inch Mk.I三連装砲+AFCT改"],
          GearId["16inch Mk.I三連装砲改+FCR type284"]
        ]
      }
    },

    rules: [
      {
        byShip: { shipClassId: ShipClassId.NelsonClass },
        multiple: { firepower: 2, armor: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.QueenElizabethClass },
        multiple: { firepower: 2, armor: 1, evasion: -2 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: 6 },
        multiple: { firepower: 1, armor: 1, evasion: -3 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["35.6cm連装砲改"] },
    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.IseClass, ShipClassId.FusouClass] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: 1 },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: { $in: [2, 6] } },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["金剛改二丙"] },
        multiple: { firepower: 3, torpedo: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["35.6cm連装砲改二"] },
    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.IseClass, ShipClassId.FusouClass] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: 1 },
        multiple: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: 2 },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: 6 },
        multiple: { firepower: 3, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["金剛改二丙"] },
        multiple: { firepower: 4, torpedo: 2, antiAir: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["16inch Mk.I連装砲"] },
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["長門改二"], ShipId["陸奥改二"], ShipId["Nelson改"]] } },
        multiple: { firepower: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.NagatoClass, ShipClassId.ColoradoClass] }, rank: { $lte: 2 } },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["16inch Mk.V連装砲"] },
    rules: [
      {
        byShip: { shipId: ShipId["Colorado改"] },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["長門改二"], ShipId["陸奥改二"], ShipId["Nelson改"]] } },
        multiple: { firepower: 2 }
      },
      {
        byShip: {
          $or: [{ shipClassId: ShipClassId.NagatoClass, rank: { $lte: 2 } }, { shipId: ShipId["Colorado"] }]
        },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["16inch Mk.VIII連装砲改"] },
    rules: [
      {
        byShip: { shipId: ShipId["Colorado改"] },
        multiple: { firepower: 2, evasion: 1, antiAir: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["長門改二"], ShipId["陸奥改二"], ShipId["Nelson改"]] } },
        multiple: { firepower: 2 }
      },
      {
        byShip: {
          $or: [{ shipClassId: ShipClassId.NagatoClass, rank: { $lte: 2 } }, { shipId: ShipId["Colorado"] }]
        },
        multiple: { firepower: 1 }
      }
    ]
  },

  // 副砲
  {
    byGear: GearId["5inch 単装高角砲群"],
    rules: [
      {
        byShip: { attrs: { $in: ["UsNavy", "RoyalNavy"] } },
        multiple: { firepower: 1, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.NorthamptonClass },
        multiple: { firepower: 1, antiAir: 2, evasion: 2 }
      }
    ]
  },

  // 魚雷
  {
    byGear: { gearId: GearId["53cm連装魚雷"] },
    rules: [
      {
        byShip: { shipClassId: ShipClassId.KamikazeClass },
        multiple: { torpedo: 1, evasion: 2 }
      },
      {
        byShip: { shipId: ShipId["金剛改二丙"] },
        multiple: { torpedo: 6, evasion: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.YuubariClass, attrs: "Kai2" },
        multiple: { firepower: 2, torpedo: 4 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["61cm三連装(酸素)魚雷後期型"] },
    byShip: {
      shipClassId: {
        $in: [ShipClassId.FubukiClass, ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass, ShipClassId.HatsuharuClass]
      },
      attrs: "Kai2"
    },
    countCap: 2,
    rules: [
      {
        multiple: { torpedo: 2, evasion: 1 }
      },
      {
        minStar: 10,
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: { gearId: GearId["61cm四連装(酸素)魚雷後期型"] },
    byShip: {
      shipClassId: {
        $in: [ShipClassId.ShiratsuyuClass, ShipClassId.AsashioClass, ShipClassId.KagerouClass, ShipClassId.YuugumoClass]
      },
      attrs: "Kai2"
    },
    countCap: 2,
    rules: [
      {
        multiple: { torpedo: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KagerouClass },
        minStar: 5,
        multiple: { torpedo: 1 }
      },
      {
        minStar: 10,
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["533mm 三連装魚雷"],
    byShip: { attrs: "SovietNavy", shipTypeId: ShipTypeId.Destroyer },
    multiple: { firepower: 1, torpedo: 3, armor: 1 }
  },

  {
    byGear: GearId["533mm五連装魚雷(初期型)"],
    byShip: { attrs: "UsNavy", shipTypeId: ShipTypeId.Destroyer },
    multiple: { firepower: 1, torpedo: 3 }
  },

  {
    byGear: GearId["61cm四連装(酸素)魚雷"],
    byShip: { shipClassId: ShipClassId.KagerouClass, attrs: "Kai2" },
    countCap: 2,
    multiple: { torpedo: 2 }
  },

  {
    byGear: GearId["61cm五連装(酸素)魚雷"],
    byShip: {
      $or: [
        { shipTypeId: ShipTypeId.TorpedoCruiser },
        { shipClassId: { $in: [ShipClassId.ShimakazeClass, ShipClassId.AkizukiClass] } }
      ]
    },
    multiple: { torpedo: 1 }
  },

  {
    byGear: GearId["試製61cm六連装(酸素)魚雷"],
    byShip: { shipClassId: ShipClassId.AkizukiClass },
    multiple: { torpedo: 1 }
  },

  {
    byGear: GearId["53cm艦首(酸素)魚雷"],
    byShip: { shipTypeId: { $nin: [ShipTypeId.Submarine, ShipTypeId.SubmarineAircraftCarrier] } },
    multiple: { torpedo: -5 }
  },

  // 特殊潜航艇
  {
    byGear: GearId["甲標的 丁型改(蛟龍改)"],
    rules: [
      {
        byShip: ShipId["夕張改二特"],
        multiple: { firepower: 1, torpedo: 4, evasion: -2 }
      },
      {
        byShip: ShipId["北上改二"],
        multiple: { torpedo: 2, evasion: -2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["大井改二"], ShipId["日進甲"]] } },
        multiple: { torpedo: 1, evasion: -2 }
      },
      {
        byShip: {
          shipId: { $not: { $in: [ShipId["夕張改二特"], ShipId["北上改二"], ShipId["大井改二"], ShipId["日進甲"]] } }
        },
        multiple: { firepower: -1, evasion: -7 }
      }
    ]
  },

  // 水上爆撃機
  {
    byGear: { gearId: { $in: [GearId["瑞雲(六三四空)"], GearId["瑞雲12型(六三四空)"]] } },
    rules: [
      {
        byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
        multiple: { firepower: 3 }
      },
      {
        byShip: {
          $or: [
            { shipClassId: ShipClassId.FusouClass, shipTypeId: ShipTypeId.AviationBattleship },
            { shipClassId: ShipClassId.IseClass, attrs: "Kai" }
          ]
        },
        multiple: { firepower: 2 }
      }
    ]
  },

  {
    byGear: GearId["瑞雲(六三四空/熟練)"],
    rules: [
      {
        byShip: { shipClassId: ShipClassId.FusouClass, shipTypeId: ShipTypeId.AviationBattleship },
        multiple: { firepower: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai" },
        multiple: { firepower: 3, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
        multiple: { firepower: 4, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["瑞雲改二(六三四空)"],
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 5, antiAir: 2, asw: 1, evasion: 2 }
  },

  {
    byGear: GearId["瑞雲改二(六三四空/熟練)"],
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 6, antiAir: 3, asw: 2, evasion: 3 }
  },

  {
    byGear: GearId["S9 Osprey"],
    rules: [
      {
        byShip: {
          shipClassId: {
            $in: [ShipClassId.KumaClass, ShipClassId.NagaraClass, ShipClassId.SendaiClass, ShipClassId.AganoClass]
          }
        },
        multiple: { firepower: 1, evasion: 1, asw: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.GotlandClass },
        multiple: { firepower: 1, evasion: 2, asw: 2 }
      }
    ]
  },

  {
    byGear: GearId["Laté 298B"],
    effectiveLosBonus: true,
    rules: [
      {
        byShip: ShipId["Richelieu改"],
        multiple: { firepower: 1, evasion: 2, los: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.CommandantTesteClass },
        multiple: { firepower: 3, evasion: 2, los: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.MizuhoClass, ShipClassId.KamoiClass] } },
        multiple: { evasion: 1, los: 2 }
      }
    ]
  },

  {
    byGear: GearId["Swordfish(水上機型)"],
    rules: [
      {
        byShip: { remodelGroup: RemodelGroup["Gotland"] },
        multiple: { firepower: 2, asw: 1, evasion: 1, los: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.CommandantTesteClass },
        multiple: { firepower: 1, asw: 1, evasion: 1, los: 1 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.MizuhoClass, ShipClassId.KamoiClass] } },
        multiple: { firepower: 1, evasion: 1, los: 1 }
      },
      {
        byShip: { attrs: "RoyalNavy" },
        multiple: { firepower: 2, evasion: 2, los: 2 }
      }
    ]
  },

  {
    byGear: GearId["Swordfish Mk.III改(水上機型)"],
    rules: [
      {
        byShip: { remodelGroup: RemodelGroup["Gotland"] },
        multiple: { firepower: 4, asw: 3, evasion: 2, los: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.CommandantTesteClass },
        multiple: { firepower: 2, asw: 3, evasion: 1, los: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.MizuhoClass, ShipClassId.KamoiClass] } },
        multiple: { firepower: 1, asw: 2, evasion: 1, los: 2 }
      },
      {
        byShip: { attrs: "RoyalNavy" },
        multiple: { firepower: 2, asw: 2, evasion: 2, los: 2 }
      }
    ]
  },

  // 艦上戦闘機
  {
    byGear: GearId["九六式艦戦"],
    rules: [
      {
        byShip: { shipTypeId: ShipTypeId.LightAircraftCarrier },
        multiple: { antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.HoushouClass },
        multiple: { firepower: 2, asw: 2, evasion: 2, antiAir: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.KasugaMaruClass, ShipClassId.TaiyouClass] } },
        multiple: { firepower: 2, asw: 3 }
      }
    ]
  },

  {
    byGear: GearId["九六式艦戦改"],
    rules: [
      {
        byShip: { shipTypeId: ShipTypeId.LightAircraftCarrier },
        multiple: { antiAir: 1, asw: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.HoushouClass },
        multiple: { firepower: 3, antiAir: 3, evasion: 4, asw: 4 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.KasugaMaruClass, ShipClassId.TaiyouClass] } },
        multiple: { firepower: 2, antiAir: 1, asw: 5, evasion: 1 }
      }
    ]
  },

  {
    byGear: GearId["烈風改(試製艦載型)"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["赤城改二"], ShipId["赤城改二戊"]] } },
        count1: { antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
        count1: { antiAir: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: GearId["烈風改二"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["赤城改二"], ShipId["赤城改二戊"]] } },
        count1: { firepower: 1, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
        count1: { firepower: 1, antiAir: 1, evasion: 1 }
      }
    ]
  },

  {
    byGear: GearId["烈風改二戊型"],
    rules: [
      {
        byShip: ShipId["赤城改二戊"],
        count1: { firepower: 4, antiAir: 3, evasion: 4 }
      },
      {
        byShip: ShipId["赤城改二"],
        count1: { firepower: 1, antiAir: 2, evasion: 3 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
        count1: { firepower: 1, antiAir: 1, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["烈風改二戊型(一航戦/熟練)"],
    rules: [
      {
        byShip: ShipId["赤城改二戊"],
        count1: { firepower: 6, antiAir: 4, evasion: 5 }
      },
      {
        byShip: ShipId["赤城改二"],
        count1: { firepower: 1, antiAir: 3, evasion: 4 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
        count1: { firepower: 1, antiAir: 2, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["Re.2001 OR改"],
    byShip: { shipClassId: ShipClassId.AquilaClass },
    multiple: { firepower: 1, antiAir: 2, evasion: 3 }
  },

  {
    byGear: GearId["Re.2005 改"],
    byShip: { shipClassId: { $in: [ShipClassId.AquilaClass, ShipClassId.GrafZeppelinClass] } },
    multiple: { antiAir: 1, evasion: 2 }
  },

  // 艦上爆撃機
  {
    byGear: { gearId: { $in: [GearId["彗星"], GearId["彗星一二型甲"], GearId["彗星(六〇一空)"]] } },
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 2 }
  },

  {
    byGear: GearId["九九式艦爆(江草隊)"],
    rules: [
      {
        byShip: { shipClassId: ShipClassId.HiryuuClass },
        count1: { firepower: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        count1: { firepower: 4 }
      }
    ]
  },

  {
    byGear: GearId["彗星(江草隊)"],
    rules: [
      {
        byShip: ShipId["飛龍改二"],
        count1: { firepower: 3 }
      },
      {
        byShip: ShipId["蒼龍改二"],
        count1: { firepower: 6 }
      },
      {
        byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
        count1: { firepower: 4 }
      }
    ]
  },

  {
    byGear: GearId["彗星二二型(六三四空)"],
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 6, evasion: 1 }
  },

  {
    byGear: GearId["彗星二二型(六三四空/熟練)"],
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 8, antiAir: 1, evasion: 2 }
  },

  {
    byGear: GearId["彗星一二型(六三四空/三号爆弾搭載機)"],
    byShip: { shipClassId: ShipClassId.IseClass, attrs: "Kai2" },
    multiple: { firepower: 7, antiAir: 3, evasion: 2 }
  },

  {
    byGear: GearId["彗星一二型(三一号光電管爆弾搭載機)"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["飛龍改二"], ShipId["蒼龍改二"]] } },
        multiple: { firepower: 3 }
      },
      {
        byShip: { shipId: { $in: [ShipId["鈴谷航改二"], ShipId["熊野航改二"], ShipId["日向改二"]] } },
        multiple: { firepower: 4 }
      },
      {
        byShip: ShipId["伊勢改二"],
        multiple: { firepower: 2 }
      }
    ]
  },

  {
    byGear: { gearId: { $in: [GearId["Ju87C改二(KMX搭載機)"], GearId["Ju87C改二(KMX搭載機/熟練)"]] } },
    rules: [
      {
        byShip: { shipClassId: { $in: [ShipClassId.AquilaClass, ShipClassId.GrafZeppelinClass] } },
        multiple: { firepower: 1, evasion: 1 }
      },
      {
        byShip: { remodelGroup: RemodelGroup["春日丸"], rank: { $gte: 2 } },
        multiple: { asw: 1, evasion: 1 }
      },
      {
        byShip: { remodelGroup: RemodelGroup["神鷹"] },
        multiple: { asw: 3, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["Re.2001 CB改"],
    byShip: { shipClassId: ShipClassId.AquilaClass },
    multiple: { firepower: 4, antiAir: 1, evasion: 1 }
  },

  // 艦上攻撃機
  {
    byGear: { gearId: { $in: [GearId["流星"], GearId["流星改"]] } },
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"], ShipId["大鳳改"]] } },
        multiple: { firepower: 1 }
      },
      {
        byShip: ShipId["赤城改二"],
        multiple: { firepower: 1, evasion: 1 }
      },
      {
        byShip: ShipId["赤城改二戊"],
        multiple: { firepower: 2, evasion: 1 }
      }
    ]
  },

  {
    byGear: GearId["流星改(一航戦)"],
    rules: [
      {
        byShip: ShipId["赤城改二戊"],
        multiple: { firepower: 3, antiAir: 2, evasion: 2 }
      },
      {
        byShip: ShipId["赤城改二"],
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: {
          $or: [
            { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
            { shipClassId: ShipClassId.ShoukakuClass, attrs: "Kai2" }
          ]
        },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["流星改(一航戦/熟練)"],
    rules: [
      {
        byShip: ShipId["赤城改二戊"],
        multiple: { firepower: 5, antiAir: 3, evasion: 3 }
      },
      {
        byShip: ShipId["赤城改二"],
        multiple: { firepower: 3, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["加賀改"]] } },
        multiple: { firepower: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.ShoukakuClass, attrs: "Kai2" },
        multiple: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["九七式艦攻(友永隊)"],
    rules: [
      {
        byShip: { shipClassId: ShipClassId.HiryuuClass },
        count1: { firepower: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        count1: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["天山一二型(友永隊)"],
    rules: [
      {
        byShip: ShipId["飛龍改二"],
        count1: { firepower: 7 }
      },
      {
        byShip: ShipId["蒼龍改二"],
        count1: { firepower: 3 }
      }
    ]
  },

  {
    byGear: GearId["九七式艦攻(村田隊)"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["赤城改二"]] } },
        count1: { firepower: 3 }
      },
      {
        byShip: {
          shipId: {
            $in: [ShipId["加賀改"], ShipId["翔鶴"], ShipId["翔鶴改"], ShipId["翔鶴改二"], ShipId["翔鶴改二甲"]]
          }
        },
        count1: { firepower: 2 }
      },
      {
        byShip: {
          shipId: {
            $in: [ShipId["龍驤改二"], ShipId["瑞鶴"], ShipId["瑞鶴改"], ShipId["瑞鶴改二"], ShipId["瑞鶴改二甲"]]
          }
        },
        count1: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["天山一二型(村田隊)"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["翔鶴改二"], ShipId["翔鶴改二甲"]] } },
        count1: { firepower: 4 }
      },
      {
        byShip: { shipId: { $in: [ShipId["赤城改"], ShipId["赤城改二"], ShipId["赤城改二戊"]] } },
        count1: { firepower: 3 }
      },
      {
        byShip: {
          shipId: {
            $in: [ShipId["加賀改"], ShipId["翔鶴"], ShipId["翔鶴改"], ShipId["瑞鶴改二"], ShipId["瑞鶴改二甲"]]
          }
        },
        count1: { firepower: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["瑞鶴"], ShipId["瑞鶴改"], ShipId["龍驤改二"]] } },
        count1: { firepower: 1 }
      }
    ]
  },

  {
    byGear: { gearId: { $in: [GearId["九七式艦攻(九三一空)"], GearId["九七式艦攻(九三一空/熟練)"]] } },
    byShip: { shipClassId: ShipClassId.TaiyouClass },
    multiple: { asw: 1, evasion: 1 }
  },

  {
    byGear: GearId["Re.2001 G改"],
    byShip: { shipClassId: ShipClassId.AquilaClass },
    multiple: { firepower: 3, antiAir: 1, evasion: 1 }
  },

  {
    byGear: GearId["九七式艦攻改 試製三号戊型(空六号電探改装備機)"],
    rules: [
      {
        byShip: ShipId["龍鳳改"],
        multiple: { firepower: 4, asw: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["瑞鳳改二"], ShipId["瑞鳳改二乙"]] } },
        multiple: { firepower: 2, asw: 2 }
      },
      {
        byShip: ShipId["赤城改二戊"],
        multiple: { firepower: 3 }
      },
      {
        byShip: ShipId["祥鳳改"],
        multiple: { firepower: 2, asw: 1 }
      }
    ]
  },

  {
    byGear: GearId["九七式艦攻改(熟練) 試製三号戊型(空六号電探改装備機)"],
    rules: [
      {
        byShip: ShipId["龍鳳改"],
        multiple: { firepower: 5, evasion: 2, asw: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["瑞鳳改二"], ShipId["瑞鳳改二乙"]] } },
        multiple: { firepower: 3, evasion: 3, asw: 2 }
      },
      {
        byShip: ShipId["赤城改二戊"],
        multiple: { firepower: 3, evasion: 1 }
      },
      {
        byShip: ShipId["祥鳳改"],
        multiple: { firepower: 3, evasion: 1, asw: 1 }
      }
    ]
  },

  // 艦上偵察機
  {
    byGear: {
      categoryId: {
        $in: [GearCategoryId.CarrierBasedReconnaissanceAircraft, GearCategoryId.CarrierBasedReconnaissanceAircraft2]
      }
    },
    effectiveLosBonus: true,
    rules: [
      { minStar: 2, count1: { los: 1 } },
      { minStar: 4, count1: { firepower: 1 } },
      { minStar: 6, count1: { los: 1 } },
      { minStar: 10, count1: { firepower: 1, los: 1 } }
    ]
  },

  {
    byGear: GearId["二式艦上偵察機"],
    effectiveLosBonus: true,
    rules: [
      {
        byShip: ShipId["伊勢改二"],
        count1: { firepower: 3, evasion: 2, armor: 1, accuracy: 5, range: 1 }
      },
      {
        byShip: ShipId["日向改二"],
        count1: { firepower: 3, evasion: 3, armor: 3, accuracy: 5, range: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["飛龍改二"], ShipId["蒼龍改二"]] } },
        count1: { accuracy: 5, range: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        minStar: 1,
        count1: { firepower: 3, los: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.SouryuuClass },
        minStar: 8,
        count1: { firepower: 1, los: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.HiryuuClass },
        minStar: 1,
        count1: { firepower: 2, los: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["瑞鳳改二乙"], ShipId["鈴谷航改二"], ShipId["熊野航改二"]] } },
        minStar: 1,
        count1: { firepower: 1, los: 1 }
      }
    ]
  },

  // 電探
  {
    byGear: GearId["13号対空電探改"],
    rules: [
      {
        byShip: {
          shipId: {
            $in: [ShipId["潮改二"], ShipId["時雨改二"], ShipId["初霜改二"], ShipId["榛名改二"], ShipId["長門改二"]]
          }
        },
        multiple: { firepower: 1, antiAir: 2, evasion: 3, armor: 1 }
      },
      {
        byShip: {
          remodelGroup: {
            $in: [
              RemodelGroup["矢矧"],
              RemodelGroup["霞"],
              RemodelGroup["雪風"],
              RemodelGroup["磯風"],
              RemodelGroup["浜風"],
              RemodelGroup["朝霜"],
              RemodelGroup["涼月"]
            ]
          }
        },
        multiple: { antiAir: 2, evasion: 2, armor: 1 }
      },
      {
        byShip: { remodelGroup: { $in: [RemodelGroup["大淀"], RemodelGroup["響"], RemodelGroup["鹿島"]] } },
        multiple: { antiAir: 1, evasion: 3, armor: 1 }
      }
    ]
  },

  {
    byGear: GearId["GFCS Mk.37"],
    byShip: { attrs: "UsNavy" },
    multiple: { firepower: 1, antiAir: 1, evasion: 1 }
  },

  {
    byGear: GearId["SG レーダー(初期型)"],
    rules: [
      {
        byShip: { attrs: "UsNavy" },
        multiple: { firepower: 2, evasion: 3, los: 4 }
      },
      {
        byShip: { attrs: "UsNavy", shipTypeId: ShipTypeId.Destroyer },
        multiple: { firepower: 1 },
        count1: { range: 1 }
      }
    ]
  },
  {
    byGear: { attrs: "AirRadar" },
    byShip: ShipId["沖波改二"],
    count1: { firepower: 1, antiAir: 2, evasion: 3 }
  },

  // ソナー
  {
    byGear: GearId["三式水中探信儀"],
    rules: [
      {
        byShip: {
          remodelGroup: {
            $in: [
              RemodelGroup["神風"],
              RemodelGroup["春風"],
              RemodelGroup["時雨"],
              RemodelGroup["山風"],
              RemodelGroup["舞風"],
              RemodelGroup["朝霜"]
            ]
          }
        },
        multiple: { firepower: 1, evasion: 2, asw: 3 }
      },
      {
        byShip: {
          remodelGroup: {
            $in: [
              RemodelGroup["潮"],
              RemodelGroup["雷"],
              RemodelGroup["山雲"],
              RemodelGroup["磯風"],
              RemodelGroup["浜風"],
              RemodelGroup["岸波"]
            ]
          }
        },
        multiple: { evasion: 2, asw: 2 }
      }
    ]
  },

  {
    byGear: GearId["四式水中聴音機"],
    rules: [
      {
        byShip: {
          shipId: {
            $in: [
              ShipId["那珂改二"],
              ShipId["由良改二"],
              ShipId["五十鈴改二"],
              ShipId["夕張改二"],
              ShipId["夕張改二特"]
            ]
          }
        },
        count1: { evasion: 3, asw: 1 }
      },
      {
        byShip: ShipId["夕張改二丁"],
        count1: { evasion: 5, asw: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.AkizukiClass },
        count1: { evasion: 2, asw: 1 }
      }
    ]
  },

  // 対艦強化弾
  {
    byGear: GearId["一式徹甲弾改"],
    rules: [
      {
        byShip: { shipId: ShipId["金剛改二丙"] },
        count1: { firepower: 3 }
      },
      {
        byShip: { shipClassId: ShipClassId.YamatoClass, rank: { $gte: 2 } },
        count1: { firepower: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.NagatoClass, attrs: "Kai2" },
        count1: { firepower: 2 }
      },
      {
        byShip: {
          shipClassId: { $in: [ShipClassId.KongouClass, ShipClassId.FusouClass, ShipClassId.IseClass] },
          rank: { $lte: 6 }
        },
        count1: { firepower: 1 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.NagatoClass, ShipClassId.YamatoClass] }, rank: 1 },
        count1: { firepower: 1 }
      }
    ]
  },

  // 対空強化弾
  {
    byGear: GearId["三式弾"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["金剛改二"], ShipId["金剛改二丙"]] } },
        count1: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: ShipId["比叡改二"],
        count1: { antiAir: 1 }
      },
      {
        byShip: ShipId["榛名改二"],
        count1: { antiAir: 1, evasion: 1 }
      },
      {
        byShip: ShipId["霧島改二"],
        count1: { firepower: 1 }
      }
    ]
  },

  {
    byGear: GearId["三式弾改"],
    rules: [
      {
        byShip: { shipId: { $in: [ShipId["金剛改二"], ShipId["金剛改二丙"]] } },
        count1: { firepower: 3, antiAir: 3 }
      },
      {
        byShip: ShipId["比叡改二"],
        count1: { firepower: 2, antiAir: 2 }
      },
      {
        byShip: { shipId: { $in: [ShipId["榛名改二"], ShipId["陸奥改二"]] } },
        count1: { firepower: 2, antiAir: 2, evasion: 1 }
      },
      {
        byShip: ShipId["霧島改二"],
        count1: { firepower: 3, antiAir: 2 }
      },
      {
        byShip: ShipId["長門改二"],
        count1: { firepower: 1, antiAir: 2 }
      },
      {
        byShip: { shipClassId: ShipClassId.KongouClass, rank: { $lte: 2 } },
        count1: { firepower: 1, antiAir: 1 }
      }
    ]
  },

  // 対空機銃
  {
    byGear: GearId["20連装7inch UP Rocket Launchers"],
    byShip: { attrs: "RoyalNavy" },
    multiple: { antiAir: 2, evasion: 1, armor: 1 }
  },

  // バルジ
  {
    byGear: GearId["北方迷彩(+北方装備)"],
    byShip: { shipId: { $in: [ShipId["多摩改"], ShipId["多摩改二"], ShipId["木曾改"], ShipId["木曾改二"]] } },
    count1: { evasion: 7, armor: 2 }
  },

  // 探照灯
  {
    byGear: GearId["探照灯"],
    rules: [
      {
        byShip: { remodelGroup: RemodelGroup["神通"] },
        count1: { firepower: 8, torpedo: 6, evasion: -1 }
      },
      {
        byShip: {
          remodelGroup: { $in: [RemodelGroup["比叡"], RemodelGroup["霧島"], RemodelGroup["鳥海"], RemodelGroup["暁"]] }
        },
        count1: { firepower: 4, evasion: -1 }
      },
      {
        byShip: { remodelGroup: RemodelGroup["秋雲"] },
        multiple: { firepower: 2 }
      },
      {
        byShip: { remodelGroup: RemodelGroup["雪風"] },
        multiple: { firepower: 1, antiAir: 1 }
      }
    ]
  },

  {
    byGear: GearId["96式150cm探照灯"],
    rules: [
      {
        byShip: { remodelGroup: { $in: [RemodelGroup["比叡"], RemodelGroup["霧島"]] } },
        count1: { firepower: 6, evasion: -2 }
      },
      {
        byShip: { remodelGroup: { $in: [RemodelGroup["大和"], RemodelGroup["武蔵"]] } },
        count1: { firepower: 4, evasion: -1 }
      }
    ]
  },

  // 回転翼機
  {
    byGear: { gearId: { $in: [GearId["オ号観測機改"], GearId["オ号観測機改二"]] } },
    rules: [
      {
        byShip: ShipId["伊勢改二"],
        multiple: { antiAir: 1, evasion: 1 }
      },
      {
        byShip: ShipId["日向改二"],
        multiple: { antiAir: 2, evasion: 1 }
      }
    ]
  },

  {
    byGear: GearId["S-51J"],
    rules: [
      {
        byShip: ShipId["伊勢改二"],
        multiple: { asw: 2, evasion: 1 }
      },
      {
        byShip: ShipId["日向改二"],
        multiple: { firepower: 1, asw: 3, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["S-51J改"],
    rules: [
      {
        byShip: ShipId["伊勢改二"],
        multiple: { firepower: 1, asw: 3, evasion: 1 }
      },
      {
        byShip: ShipId["日向改二"],
        multiple: { firepower: 2, asw: 4, evasion: 2 }
      }
    ]
  },

  {
    byGear: GearId["熟練見張員"],
    rules: [
      {
        byShip: { shipClassId: { $in: [66, 28, 12, 1, 5, 10, 23, 18, 30, 38, 22, 54] } },
        multiple: { firepower: 1, torpedo: 2, evasion: 2, asw: 2, los: 1 }
      },
      {
        byShip: { shipClassId: { $in: [21, 4, 20, 16, 34, 56, 41, 52] } },
        multiple: { firepower: 1, torpedo: 2, evasion: 2, los: 3 }
      },
      {
        byShip: { shipClassId: { $in: [7, 13, 29, 8, 9, 31] } },
        multiple: { firepower: 1, evasion: 2, los: 3 }
      }
    ]
  }
]

export const multiplyBonus = (bonus: StatsBonusRecord, multiplier: number) =>
  mapValues(bonus, stat => stat && stat * multiplier)

export const addBonus = (bonus: StatsBonusRecord, other: StatsBonusRecord) => {
  const result: StatsBonusRecord = {}
  for (const key of shipStatKeys) {
    const stat = (bonus[key] || 0) + (other[key] || 0)
    if (stat !== 0) result[key] = stat
  }
  return result
}

const statBonusRuleToRecord = (ship: IShip, byGear: GearQuery, count: number) => (rule: StatBonusRule) => {
  const { byShip, minStar, countCap, multiple, count4, count3, count2, count1 } = rule
  let record: StatsBonusRecord = {}
  if (byShip && !ship.match(byShip)) {
    return record
  }
  if (minStar) {
    const starCount = ship.countGear(gear => gear.match(byGear) && gear.star >= minStar)
    count = Math.min(count, starCount)
  }
  if (countCap) {
    count = Math.min(count, countCap)
  }

  if (multiple) {
    record = multiplyBonus(multiple, count)
  }

  ;[count1, count2, count3, count4].forEach((countBonus, index) => {
    if (countBonus && count > index) {
      record = addBonus(record, countBonus)
    }
  })

  return record
}

export const equipmentBonusRuleToRecord = (ship: IShip) => {
  const toRecord = (rule: EquipmentBonusRule): StatsBonusRecord => {
    const { byGear, byShip, countCap, rules, synergies, effectiveLosBonus } = rule

    if (byShip && !ship.match(byShip)) {
      return {}
    }

    let count = ship.countGear(gear => gear.match(byGear))
    if (count === 0) {
      return {}
    }
    if (countCap) {
      count = Math.min(countCap, count)
    }

    const toRecordWithCount = statBonusRuleToRecord(ship, byGear, count)
    const parentBonus = toRecordWithCount(rule)
    let bonus = rules ? rules.map(toRecordWithCount).reduce(addBonus, parentBonus) : parentBonus

    if (synergies) {
      const synergyBonus = synergies.map(toRecord).reduce(addBonus, {})
      bonus = addBonus(bonus, synergyBonus)
    }

    if (effectiveLosBonus && bonus.los) {
      bonus = addBonus(bonus, { effectiveLos: bonus.los })
    }

    return bonus
  }

  return toRecord
}

const getSpeedBonus = (ship: IShip) => {
  if (!ship.hasGear(GearId["改良型艦本式タービン"])) {
    return {}
  }

  const speedGroup = Speed.getSpeedGroup(ship)
  const enhancedBoilerCount = ship.countGear(GearId["強化型艦本式缶"])
  const newModelBoilerCount = ship.countGear(GearId["新型高温高圧缶"])
  const speedIncrement = Speed.getSpeedIncrement(speedGroup, enhancedBoilerCount, newModelBoilerCount)

  if (speedIncrement > 0) {
    return { speed: speedIncrement }
  }

  if (ship.shipClassId === ShipClassId.JohnCButlerClass || ship.shipId === ShipId["夕張改二特"]) {
    return { speed: 5 }
  }

  return {}
}

const get3gouBonus = (ship: IShip): StatsBonusRecord => {
  const { shipTypeId } = ship
  const count = ship.countGear(GearId["20.3cm(3号)連装砲"])

  if (!count) {
    return {}
  }

  const bonuses: StatsBonusRecord[] = []
  if ([7, 13, 8, 29, 9, 31].includes(shipTypeId)) {
    bonuses.push({ firepower: 1 })
  }
  if ([8, 29, 9, 31].includes(shipTypeId)) {
    bonuses.push({ firepower: 1, evasion: 1 })
  }
  if ([9, 31].includes(shipTypeId) && count >= 2) {
    bonuses.push({ firepower: 1 })
  }

  const bonus1 = multiplyBonus(bonuses.reduce(addBonus, {}), count)
  let bonus2: StatsBonusRecord = {}

  if (ship.hasGear("SurfaceRadar")) {
    if ([8, 29, 9, 31].includes(shipTypeId)) {
      bonus2 = { firepower: 3, evasion: 2, torpedo: 2 }
    }
    if ([7, 13].includes(shipTypeId) && !ship.hasGear(GearId["20.3cm(2号)連装砲"])) {
      bonus2 = { firepower: 1, evasion: 1, torpedo: 1 }
    }
  }

  return addBonus(bonus1, bonus2)
}

export const getEquipmentBonus = (ship: IShip): StatsBonusRecord => {
  const speedBonus = getSpeedBonus(ship)
  const bonus3gou = get3gouBonus(ship)
  const base = addBonus(speedBonus, bonus3gou)

  const record = equipmentBonusRules.map(equipmentBonusRuleToRecord(ship)).reduce(addBonus, base)

  return record
}
