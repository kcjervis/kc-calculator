import { mapValues, mergeWith } from "lodash-es"
import { GearId, ShipClassId, ShipId } from "@jervis/data"
import { ShipQuery, IShip } from "../objects/ship/ship"
import { GearQuery } from "../objects/gear/Gear"
import { ShipTypeId } from "."
import { InternalQuery } from "sift"
import { GearCategoryId } from "./GearCategory"
import { Speed } from "../constants"

export const shipStatKeys = [
  "firepower",
  "armor",
  "torpedo",
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
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
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
    byGear: { gearId: GearId["12cm単装砲改二"] },

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
        byShip: { attrs: "UsNavy", shipTypeId: ShipTypeId.Destroyer },
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
        byShip: { shipId: ShipId["青葉改"] },
        multiple: { firepower: 1, antiAir: 1 }
      },
      {
        byShip: { shipId: ShipId["衣笠改二"] },
        multiple: { firepower: 2, evasion: 1 }
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
        byShip: { shipClassId: ShipClassId.YuubariClass },
        multiple: { firepower: 2, antiAir: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.KatoriClass },
        multiple: { firepower: 2, evasion: 1 }
      },
      {
        byShip: { shipClassId: ShipClassId.NisshinClass },
        multiple: { firepower: 3, torpedo: 2, antiAir: 1, evasion: 1 }
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
        multiple: { firepower: 3, antiAir: 2, evasion: 1 }
      },
      {
        byShip: { shipId: ShipId["日向改二"] },
        multiple: { firepower: 3, antiAir: 2, evasion: 2 }
      }
    ],

    synergies: [
      {
        byGear: { gearId: GearId["41cm連装砲改二"] },
        rules: [
          {
            byShip: { shipClassId: ShipClassId.NagatoClass, attrs: "Kai2" },
            count1: { firepower: 2, evasion: 2, armor: 1 }
          },
          {
            byShip: { shipClassId: ShipClassId.IseClass, shipTypeId: ShipTypeId.AviationBattleship },
            count1: { evasion: 2, armor: 1 }
          },
          {
            byShip: { shipId: ShipId["日向改二"] },
            count1: { firepower: 1 }
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
        multiple: { firepower: 3, antiAir: 2, evasion: 1 }
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
        count1: { antiAir: 2, evasion: 3 }
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
        multiple: { firepower: 1, asw: 1, evasion: 1 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.KasugaMaruClass, ShipClassId.TaiyouClass] } },
        multiple: { firepower: 1, asw: 2 }
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
        multiple: { firepower: 1, antiAir: 2, evasion: 2 }
      },
      {
        byShip: { shipClassId: { $in: [ShipClassId.KasugaMaruClass, ShipClassId.TaiyouClass] } },
        multiple: { firepower: 1, antiAir: 1, asw: 2, evasion: 1 }
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
        byShip: { remodelGroup: ShipId["春日丸"], rank: { $gte: 2 } },
        multiple: { asw: 1, evasion: 1 }
      },
      {
        byShip: { remodelGroup: ShipId["神鷹"] },
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
        count1: { firepower: 3, evasion: 2, armor: 1, range: 1 }
      },
      {
        byShip: ShipId["日向改二"],
        count1: { firepower: 3, evasion: 3, armor: 3, range: 1 }
      },
      {
        byShip: { shipId: { $in: [ShipId["飛龍改二"], ShipId["蒼龍改二"]] } },
        count1: { range: 1 }
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
              ShipId["矢矧"],
              ShipId["霞"],
              ShipId["雪風"],
              ShipId["磯風"],
              ShipId["浜風"],
              ShipId["朝霜"],
              ShipId["涼月"]
            ]
          }
        },
        multiple: { antiAir: 2, evasion: 2, armor: 1 }
      },
      {
        byShip: { remodelGroup: { $in: [ShipId["大淀"], ShipId["響"], ShipId["鹿島"]] } },
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
    byGear: GearId["三式水中探信儀"],
    rules: [
      {
        byShip: {
          remodelGroup: {
            $in: [ShipId["神風"], ShipId["春風"], ShipId["時雨"], ShipId["山風"], ShipId["舞風"], ShipId["朝霜"]]
          }
        },
        multiple: { firepower: 1, evasion: 2, asw: 3 }
      },
      {
        byShip: {
          remodelGroup: {
            $in: [ShipId["潮"], ShipId["雷"], ShipId["山雲"], ShipId["磯風"], ShipId["浜風"], ShipId["岸波"]]
          }
        },
        multiple: { evasion: 2, asw: 2 }
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
        byShip: { remodelGroup: ShipId["神通"] },
        count1: { firepower: 2, torpedo: 2, evasion: -1 }
      },
      {
        byShip: { remodelGroup: { $in: [ShipId["比叡"], ShipId["霧島"], ShipId["鳥海"], ShipId["暁"]] } },
        count1: { firepower: 2, evasion: -1 }
      },
      {
        byShip: { remodelGroup: ShipId["秋雲"] },
        multiple: { firepower: 1 }
      },
      {
        byShip: { remodelGroup: ShipId["雪風"] },
        multiple: { antiAir: 1 }
      }
    ]
  },

  {
    byGear: GearId["96式150cm探照灯"],
    byShip: { remodelGroup: { $in: [ShipId["比叡"], ShipId["霧島"]] } },
    count1: { firepower: 3, evasion: -2 }
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

  if (ship.shipClassId === ShipClassId.JohnCButlerClass) {
    return { speed: 5 }
  }

  return {}
}

export const getEquipmentBonus = (ship: IShip): StatsBonusRecord => {
  const speedBonus = getSpeedBonus(ship)
  const record = equipmentBonusRules.map(equipmentBonusRuleToRecord(ship)).reduce(addBonus, speedBonus)
  return record
}