import { IShip } from '../Ship'
import StatsBonus, { StatsBonusCreator } from './StatsBonus'

import createBonus104 from './104'
import createBonus15 from './15'
import createBonus174 from './174'
import createBonus179 from './179'
import createBonus229 from './229'
import createBonus237 from './237'
import createBonus266 from './266'
import createBonus267 from './267'
import createBonus268 from './268'
import createBonus285 from './285'
import createBonus289 from './289'
import createBonus290 from './290'
import createBonus293 from './293'
import createBonus294 from './294'
import createBonus295 from './295'
import createBonus296 from './296'
import createBonus297 from './297'
import createBonus301 from './301'
import createBonus304 from './304'
import createBonus307 from './307'
import createBonus33 from './33'
import createBonus58 from './58'
import createBonus61 from './61'
import createBonus63 from './63'
import createBonus67 from './67'
import createBonusBL16InchMkI from './BL16InchMkI'
import createBonusJu87CKai2KMX from './Ju87CKai2KMX'
import mediumCaliberMainGunBonusCreators from './mediumCaliberMainGun'
import radarBonusCreators from './radar'
import searchlightBonusCreators from './searchlight'
import smallCaliberMainGunBonusCreators from './smallCaliberMainGun'
import createBonusSuisei from './Suisei'
import createBonusType97TorpedoBomber931AirGroup from './Type97TorpedoBomber931AirGroup'
import createBonusZuiun634AirGroup from './Zuiun634AirGroup'

export const statsBonusCreators: StatsBonusCreator[] = [
  ...searchlightBonusCreators,
  ...smallCaliberMainGunBonusCreators,
  ...mediumCaliberMainGunBonusCreators,
  ...radarBonusCreators,
  createBonus104,
  createBonus15,
  createBonus174,
  createBonus179,
  createBonus229,
  createBonus237,
  createBonus266,
  createBonus267,
  createBonus268,
  createBonus285,
  createBonus289,
  createBonus290,
  createBonus293,
  createBonus294,
  createBonus295,
  createBonus296,
  createBonus297,
  createBonus301,

  createBonus304,
  createBonus307,
  createBonus33,
  createBonus58,
  createBonus61,
  createBonus63,
  createBonus67,
  createBonusBL16InchMkI,
  createBonusJu87CKai2KMX,
  createBonusSuisei,
  createBonusType97TorpedoBomber931AirGroup,
  createBonusZuiun634AirGroup
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
