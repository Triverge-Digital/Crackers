export interface PriceListItem {
  code: string
  name: string
  mrp: number
  unit: string
  discountPrice: number
}

export interface PriceListCategory {
  name: string
  items: PriceListItem[]
}

export const PRICE_LIST_DATA: PriceListCategory[] = [
  {
    name: "SINGLE SOUND CRACKERS",
    items: [
      { code: "1", name: "2 3/4\" KURUVI", mrp: 40, unit: "1 PKT", discountPrice: 8 },
      { code: "2", name: "3 1/2\" LAKSHMI", mrp: 80, unit: "1 PKT", discountPrice: 16 },
      { code: "3", name: "4\" LAKSHMI", mrp: 100, unit: "1 PKT", discountPrice: 20 },
      { code: "4", name: "4\" DELUXE LAKSHMI", mrp: 150, unit: "1 PKT", discountPrice: 30 },
      { code: "5", name: "4\" GOLD LAKSHMI", mrp: 175, unit: "1 PKT", discountPrice: 35 },
      { code: "6", name: "5\" MEGA LAKSHMI", mrp: 190, unit: "1 PKT", discountPrice: 38 },
      { code: "7", name: "2 SOUND CRACKERS", mrp: 175, unit: "1 PKT", discountPrice: 35 },
      { code: "8", name: "ELEPHANT CRACKERS", mrp: 250, unit: "1 PKT", discountPrice: 50 },
      { code: "9", name: "28 Chorsa", mrp: 70, unit: "1 PKT", discountPrice: 14 },
      { code: "10", name: "28 Giant", mrp: 120, unit: "1 PKT", discountPrice: 24 },
      { code: "11", name: "56 Giant", mrp: 200, unit: "1 PKT", discountPrice: 40 },
    ],
  },
  {
    name: "DELUXE CRACKER",
    items: [
      { code: "12", name: "24 DELUXE", mrp: 250, unit: "1 PKT", discountPrice: 50 },
      { code: "13", name: "50 DELUXE", mrp: 500, unit: "1 PKT", discountPrice: 100 },
      { code: "14", name: "100 DELUXE", mrp: 1100, unit: "1 PKT", discountPrice: 220 },
    ],
  },
  {
    name: "BIJILI CRACKERS",
    items: [
      { code: "15", name: "RED BIJILI", mrp: 160, unit: "1 PKT", discountPrice: 32 },
      { code: "16", name: "STRIPPED BIJILI", mrp: 170, unit: "1 PKT", discountPrice: 34 },
    ],
  },
  {
    name: "ROCKETS",
    items: [
      { code: "17", name: "BABY ROCKET", mrp: 300, unit: "1 BOX", discountPrice: 60 },
      { code: "18", name: "ROCKET BOMB", mrp: 450, unit: "1 BOX", discountPrice: 90 },
      { code: "19", name: "LUNIK ROCKET", mrp: 700, unit: "1 BOX", discountPrice: 140 },
      { code: "20", name: "MUSICAL ROCKET", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "21", name: "2SOUND ROCKET", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
    ],
  },
  {
    name: "CANDLES",
    items: [
      { code: "22", name: "7\" MAGIC PENCIL", mrp: 125, unit: "1 BOX", discountPrice: 25 },
      { code: "23", name: "12\" PENCIL", mrp: 275, unit: "1 BOX", discountPrice: 55 },
    ],
  },
  {
    name: "COLOR PENCIL",
    items: [
      { code: "24", name: "ULTRA PENCIL (3PCS)", mrp: 400, unit: "1 BOX", discountPrice: 80 },
      { code: "25", name: "NAVARAG PENCIL (5PCS)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "26", name: "POPCORN PENCIL (5PCS)", mrp: 1200, unit: "1 BOX", discountPrice: 240 },
      { code: "27", name: "SELFIE STICK (5PCS)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
    ],
  },
  {
    name: "NIGHT CRACKLING EFFECTS",
    items: [
      { code: "28", name: "BAT AND BALL", mrp: 1400, unit: "1 BOX", discountPrice: 280 },
      { code: "29", name: "EMU EGG", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "30", name: "TIM TAM", mrp: 500, unit: "1 BOX", discountPrice: 100 },
      { code: "31", name: "WHITE HOUSE", mrp: 800, unit: "1 BOX", discountPrice: 160 },
      { code: "32", name: "COLOR CELEBRATE (5pcs)", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
    ],
  },
  {
    name: "PREMIUM GIFT BOXES",
    items: [
      { code: "157", name: "SUNRISES (22 ITEMS)", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "158", name: "ROYAL KING (26 ITEMS)", mrp: 1900, unit: "1 BOX", discountPrice: 380 },
      { code: "159", name: "MUMBAI INDIANS (31 ITEMS)", mrp: 2400, unit: "1 BOX", discountPrice: 480 },
      { code: "160", name: "CHENNAI SUPER KINGS (42 ITEMS)", mrp: 3500, unit: "1 BOX", discountPrice: 690 },
      { code: "161", name: "ANDAL NACHIYAR (51 ITEMS)", mrp: 4500, unit: "1 BOX", discountPrice: 890 },
    ],
  },
  {
    name: "LOOSE CRACKERS",
    items: [
      { code: "33", name: "1' KURUVI", mrp: 20, unit: "1 PKT", discountPrice: 4 },
      { code: "34", name: "CHORSA 28's", mrp: 70, unit: "1 PKT", discountPrice: 14 },
      { code: "35", name: "GIANT 28's", mrp: 120, unit: "1 PKT", discountPrice: 24 },
      { code: "36", name: "DELUXE 24's", mrp: 250, unit: "1 PKT", discountPrice: 50 },
      { code: "37", name: "DELUXE 50's", mrp: 500, unit: "1 PKT", discountPrice: 100 },
      { code: "38", name: "DELUXE 100's", mrp: 1100, unit: "1 PKT", discountPrice: 220 },
    ],
  },
]
