import { IShip } from '../Ship'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

import createBonus104 from './35.6cm連装砲(ダズル迷彩)'
import createBonus15 from './61cm四連装(酸素)魚雷'
import createBonus174 from './53cm連装魚雷'
import createBonus179 from './試製61cm六連装(酸素)魚雷'
import createBonus229 from './12.7cm単装高角砲(後期型)'
import createBonus266 from './12.7cm連装砲C型改二'
import createBonus267 from './12.7cm連装砲D型改二'
import createBonus285 from './61cm三連装(酸素)魚雷後期型'
import createBonus289 from './35.6cm三連装砲改(ダズル迷彩仕様)'
import createBonus293 from './12cm単装砲改二'
import createBonus294 from './12.7cm連装砲A型改二'
import createBonus295 from './12.7cm連装砲A型改三(戦時改修)＋高射装置'
import createBonus296 from './12.7cm連装砲B型改四(戦時改修)＋高射装置'
import createBonus297 from './12.7cm連装砲A型'
import createBonus301 from './20連装7inch UP Rocket Launchers'
import createBonus304 from './S9 Osprey'
import createBonus33 from './改良型艦本式タービン'
import createBonus58 from './61cm五連装(酸素)魚雷'
import createBonus63 from './12.7cm連装砲B型改二'
import createBonus67 from './53cm艦首(酸素)魚雷'

import antiAirShell from './antiAirShell'
import armor from './armor'
import createBonusBL16InchMkI from './BL16InchMkI'
import searchlightBonusCreators from './searchlight'
import sonar from './sonar'
import torpedo from './torpedo'
import createBonusType97TorpedoBomber931AirGroup from './Type97TorpedoBomber931AirGroup'

import 小口径主砲 from './小口径主砲'
import 中口径主砲 from './中口径主砲'
import 大口径主砲 from './大口径主砲'
import 艦上戦闘機 from './艦上戦闘機'
import 艦上攻撃機 from './艦上攻撃機'
import 艦上爆撃機 from './艦上爆撃機'
import 艦上偵察機 from './艦上偵察機'
import 電探 from './電探'

import SeaplaneBomber from './SeaplaneBomber'
import Autogyro from './Autogyro'

export const statsBonusCreators: StatsBonusCreator[] = [
  ...小口径主砲,
  ...中口径主砲,
  ...大口径主砲,
  ...艦上戦闘機,
  ...艦上攻撃機,
  ...艦上爆撃機,
  ...艦上偵察機,
  ...電探,

  ...antiAirShell,
  ...armor,
  ...searchlightBonusCreators,
  ...torpedo,
  ...sonar,

  ...SeaplaneBomber,
  ...Autogyro,

  createBonus104,
  createBonus15,
  createBonus174,
  createBonus179,
  createBonus229,
  createBonus266,
  createBonus267,
  createBonus285,
  createBonus289,
  createBonus293,
  createBonus294,
  createBonus295,
  createBonus296,
  createBonus297,
  createBonus301,

  createBonus304,
  createBonus33,
  createBonus58,
  createBonus63,
  createBonus67,
  createBonusBL16InchMkI,
  createBonusType97TorpedoBomber931AirGroup
]

export const createExplicitStatsBonus = (ship: IShip) => {
  const explicitStatsBonus = new StatsBonus()
  statsBonusCreators.forEach(createBonus => {
    const bonus = createBonus(ship)
    if (bonus) {
      explicitStatsBonus.add(bonus)
    }
  })

  return explicitStatsBonus
}

export { StatsBonus }
