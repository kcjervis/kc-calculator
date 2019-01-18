import ShipClassId from './ShipClassId'

const data: Array<[ShipClassId, string]> = [
  [1, '綾波型'],
  [2, '伊勢型'],
  [3, '加賀型'],
  [4, '球磨型'],
  [5, '暁型'],
  [6, '金剛型'],
  [7, '古鷹型'],
  [8, '高雄型'],
  [9, '最上型'],
  [10, '初春型'],
  [11, '祥鳳型'],
  [12, '吹雪型'],
  [13, '青葉型'],
  [14, '赤城型'],
  [15, '千歳型'],
  [16, '川内型'],
  [17, '蒼龍型'],
  [18, '朝潮型'],
  [19, '長門型'],
  [20, '長良型'],
  [21, '天龍型'],
  [22, '島風型'],
  [23, '白露型'],
  [24, '飛鷹型'],
  [25, '飛龍型'],
  [26, '扶桑型'],
  [27, '鳳翔型'],
  [28, '睦月型'],
  [29, '妙高型'],
  [30, '陽炎型'],
  [31, '利根型'],
  [32, '龍驤型'],
  [33, '翔鶴型'],
  [34, '夕張型'],
  [35, '海大VI型'],
  [36, '巡潜乙型改二'],
  [37, '大和型'],
  [38, '夕雲型'],
  [39, '巡潜乙型'],
  [40, '巡潜3型'],
  [41, '阿賀野型'],
  [42, '霧の艦隊'],
  [43, '大鳳型'],
  [44, '潜特型(伊400型潜水艦)'],
  [45, '特種船丙型'],
  [46, '三式潜航輸送艇'],
  [47, 'Bismarck級'],
  [48, 'Z1型'],
  [49, '工作艦'],
  [50, '大鯨型'],
  [51, '龍鳳型'],
  [52, '大淀型'],
  [53, '雲龍型'],
  [54, '秋月型'],
  [55, 'Admiral Hipper級'],
  [56, '香取型'],
  [57, 'UボートIXC型'],
  [58, 'V.Veneto級'],
  [59, '秋津洲型'],
  [60, '改風早型'],
  [61, 'Maestrale級'],
  [62, '瑞穂型'],
  [63, 'Graf Zeppelin級'],
  [64, 'Zara級'],
  [65, 'Iowa級'],
  [66, '神風型'],
  [67, 'Queen Elizabeth級'],
  [68, 'Aquila級'],
  [69, 'Lexington級'],
  [70, 'C.Teste級'],
  [71, '巡潜甲型改二'],
  [72, '神威型'],
  [73, 'Гангут級'],
  [74, '占守型'],
  [75, '春日丸級'],
  [76, '大鷹型'],
  [77, '択捉型'],
  [78, 'Ark Royal級'],
  [79, 'Richelieu級'],
  [80, 'Guglielmo Marconi級'],
  [81, 'Ташкент級'],
  [82, 'J級'],
  [83, 'Casablanca級'],
  [84, 'Essex級'],
  [85, '日振型'],
  [86, '呂号潜水艦'],
  [87, 'John C.Butler級'],
  [88, 'Nelson級'],
  [89, 'Gotland級'],
  [90, '日進型'],
  [91, 'Fletcher級']
]

export default class ShipClass {
  public static readonly all: ShipClass[] = data.map(datum => new ShipClass(...datum))

  public static fromId(id: number) {
    const found = ShipClass.all.find(shipClass => shipClass.id === id)
    if (found) {
      return found
    }
    const newShipClass = new ShipClass(id, '')
    ShipClass.all.push(newShipClass)
    return newShipClass
  }

  private constructor(public readonly id: ShipClassId, public readonly name: string) {}

  public is = (key: keyof typeof ShipClassId) => {
    return this.id === ShipClassId[key]
  }

  public either = (...keys: Array<keyof typeof ShipClassId>) => {
    return keys.some(this.is)
  }

  /**
   * 特型駆逐艦
   */
  get isSpecialTypeDD() {
    return [ShipClassId.FubukiClass, ShipClassId.AyanamiClass, ShipClassId.AkatsukiClass].includes(this.id)
  }

  get isUsNavy() {
    return this.either('JohnCButlerClass', 'FletcherClass', 'IowaClass', 'EssexClass', 'CasablancaClass')
  }

  get isRoyalNavy() {
    return this.either('QueenElizabethClass', 'NelsonClass', 'ArkRoyalClass', 'JClass')
  }
}
