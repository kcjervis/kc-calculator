import { IShip } from '../Ship'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

import 大口径主砲 from './大口径主砲'
import mediumCaliberMainGun from './mediumCaliberMainGun'

import createBonus104 from './104'
import createBonus15 from './15'
import createBonus174 from './174'
import createBonus179 from './179'
import createBonus229 from './229'
import createBonus266 from './266'
import createBonus267 from './267'
import createBonus285 from './285'
import createBonus289 from './289'
import createBonus293 from './293'
import createBonus294 from './294'
import createBonus295 from './295'
import createBonus296 from './296'
import createBonus297 from './297'
import createBonus301 from './301'
import createBonus304 from './304'
import createBonus33 from './33'
import createBonus58 from './58'
import createBonus63 from './63'
import createBonus67 from './67'

import antiAirShell from './antiAirShell'
import armor from './armor'
import createBonusBL16InchMkI from './BL16InchMkI'
import createBonusJu87CKai2KMX from './Ju87CKai2KMX'
import radar from './radar'
import searchlightBonusCreators from './searchlight'
import smallCaliberMainGunBonusCreators from './smallCaliberMainGun'
import sonar from './sonar'
import createBonusSuisei from './Suisei'
import torpedo from './torpedo'
import createBonusType97TorpedoBomber931AirGroup from './Type97TorpedoBomber931AirGroup'

import 艦上戦闘機 from './艦上戦闘機'
import 艦上攻撃機 from './艦上攻撃機'
import 艦上爆撃機 from './艦上爆撃機'
import 艦上偵察機 from './艦上偵察機'

import SeaplaneBomber from './SeaplaneBomber'
import Autogyro from './Autogyro'

export const statsBonusCreators: StatsBonusCreator[] = [
  ...大口径主砲,
  ...艦上戦闘機,
  ...艦上攻撃機,
  ...艦上爆撃機,
  ...艦上偵察機,

  ...antiAirShell,
  ...armor,
  ...mediumCaliberMainGun,
  ...searchlightBonusCreators,
  ...smallCaliberMainGunBonusCreators,
  ...torpedo,
  ...radar,
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
  createBonusJu87CKai2KMX,
  createBonusSuisei,
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
