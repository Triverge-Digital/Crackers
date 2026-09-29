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
    name: "ONE SOUND CRACKERS",
    items: [
      { code: "1", name: "2 1/2\" KURUVI", mrp: 45, unit: "1 PKT", discountPrice: 9 },
      { code: "2", name: "3 1/2\" LAKSHMI / SPIDERMAN", mrp: 80, unit: "1 PKT", discountPrice: 16 },
      { code: "3", name: "4\" LAKSHMI", mrp: 110, unit: "1 PKT", discountPrice: 22 },
      { code: "4", name: "4\" DELUXE LAKSHMI (3 PLY)", mrp: 150, unit: "1 PKT", discountPrice: 30 },
      { code: "5", name: "4\" GOLD LAKSHMI", mrp: 210, unit: "1 PKT", discountPrice: 42 },
      { code: "6", name: "5\" MEGA LAKSHMI", mrp: 210, unit: "1 PKT", discountPrice: 42 },
      { code: "7", name: "2 SOUND CRACKERS", mrp: 190, unit: "1 PKT", discountPrice: 38 },
      { code: "8", name: "MEGA DELUXE LAKSHMI", mrp: 300, unit: "1 PKT", discountPrice: 60 },
      { code: "9", name: "28 CHORSA", mrp: 70, unit: "1 PKT", discountPrice: 14 },
      { code: "10", name: "28 GIANT", mrp: 110, unit: "1 PKT", discountPrice: 22 },
      { code: "11", name: "56 GIANT", mrp: 220, unit: "1 PKT", discountPrice: 44 }
    ],
  },
  {
    name: "DELUXE CRACKERS",
    items: [
      { code: "12", name: "24 DELUXE CRACKERS", mrp: 250, unit: "1 PKT", discountPrice: 50 },
      { code: "13", name: "50 DELUXE CRACKERS", mrp: 750, unit: "1 PKT", discountPrice: 150 },
      { code: "14", name: "100 WALA DELUXE CRACKERS", mrp: 1500, unit: "1 PKT", discountPrice: 300 }
    ],
  },
  {
    name: "BIJILI CRACKERS",
    items: [
      { code: "15", name: "RED BIJILI", mrp: 175, unit: "1 BAG", discountPrice: 35 },
      { code: "16", name: "STRIPPED BIJILI", mrp: 190, unit: "1 BAG", discountPrice: 38 }
    ],
  },
  {
    name: "ROCKETS",
    items: [
      { code: "17", name: "BABY ROCKET (10 PCS)", mrp: 225, unit: "1 BOX", discountPrice: 45 },
      { code: "18", name: "ROCKET BOMB (10 PCS)", mrp: 375, unit: "1 BOX", discountPrice: 75 },
      { code: "19", name: "LUNIK ROCKET (10 PCS)", mrp: 750, unit: "1 BOX", discountPrice: 150 },
      { code: "20", name: "MUSICAL ROCKET (10 PCS)", mrp: 800, unit: "1 BOX", discountPrice: 160 },
      { code: "21", name: "2 SOUND ROCKET", mrp: 900, unit: "1 BOX", discountPrice: 180 }
    ],
  },
  {
    name: "CANDLES",
    items: [
      { code: "22", name: "7\" MAGIC PENCIL", mrp: 160, unit: "1 BOX", discountPrice: 32 },
      { code: "23", name: "12\" PENCIL", mrp: 375, unit: "1 BOX", discountPrice: 75 }
    ],
  },
  {
    name: "MEGA COLOUR PENCIL",
    items: [
      { code: "24", name: "ULTRA PENCIL (3 PCS)", mrp: 400, unit: "1 BOX", discountPrice: 80 },
      { code: "25", name: "POP CORN PENCIL MIXING (5 PCS)", mrp: 1200, unit: "1 BOX", discountPrice: 240 },
      { code: "26", name: "SELFI STICK (5 PCS)", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "27", name: "SIVAKASI PENCIL (2 PCS)", mrp: 1200, unit: "1 BOX", discountPrice: 240 },
      { code: "28", name: "WATER FULY PENCIL", mrp: 1200, unit: "1 BOX", discountPrice: 240 },
      { code: "29", name: "POP CORN PENCIL", mrp: 1200, unit: "1 BOX", discountPrice: 240 }
    ],
  },
  {
    name: "NIGHT CRACKLING EFFECTS",
    items: [
      { code: "30", name: "BAT BALL", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "31", name: "EMU EGG", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "32", name: "WHITE HOUSE", mrp: 850, unit: "1 BOX", discountPrice: 170 },
      { code: "33", name: "COLOUR CELEBRATION", mrp: 1500, unit: "1 BOX", discountPrice: 300 }
    ],
  },
  {
    name: "BUDGET BEATS",
    items: [
      { code: "34", name: "1000 BEATS", mrp: 850, unit: "1 BOX", discountPrice: 170 },
      { code: "35", name: "2000 BEATS", mrp: 1700, unit: "1 BOX", discountPrice: 340 },
      { code: "36", name: "5000 BEATS", mrp: 4250, unit: "1 BOX", discountPrice: 850 },
      { code: "37", name: "10000 BEATS", mrp: 8500, unit: "1 BOX", discountPrice: 1700 }
    ],
  },
  {
    name: "SPECIAL BEATS",
    items: [
      { code: "38", name: "1000 BEATS", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "39", name: "2000 BEATS", mrp: 3500, unit: "1 BOX", discountPrice: 700 },
      { code: "40", name: "5000 BEATS", mrp: 7500, unit: "1 BOX", discountPrice: 1500 },
      { code: "41", name: "10000 BEATS", mrp: 15000, unit: "1 BOX", discountPrice: 3000 }
    ],
  },
  {
    name: "FLOWER POTS",
    items: [
      { code: "42", name: "FLOWER POTS SMALL", mrp: 300, unit: "1 BOX", discountPrice: 60 },
      { code: "43", name: "FLOWER POTS BIG", mrp: 425, unit: "1 BOX", discountPrice: 85 },
      { code: "44", name: "FLOWER POTS SPECIAL", mrp: 550, unit: "1 BOX", discountPrice: 110 },
      { code: "45", name: "FLOWER POTS ASOKA", mrp: 750, unit: "1 BOX", discountPrice: 150 },
      { code: "46", name: "FLOWER POTS DELUXE (5 PCS)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "47", name: "FLOWER POTS SUPER DELUXE (2 PCS)", mrp: 700, unit: "1 BOX", discountPrice: 140 },
      { code: "48", name: "COLOUR KOTI (10 PCS)", mrp: 1200, unit: "1 BOX", discountPrice: 240 },
      { code: "49", name: "COLOUR KOTI DELUXE (10 PCS)", mrp: 1750, unit: "1 BOX", discountPrice: 350 },
      { code: "50", name: "MEGA COLOUR KOTI DELUXE OR COLOUR CONE (10 PCS)", mrp: 2500, unit: "1 BOX", discountPrice: 500 },
      { code: "51", name: "TRI COLOUR FOUNTAIN", mrp: 1750, unit: "1 BOX", discountPrice: 350 },
      { code: "52", name: "GYPSY WINDOW POWER POTS (500 PCS)", mrp: 1000, unit: "1 BOX", discountPrice: 200 }
    ],
  },
  {
    name: "GROUND CHAKKARS",
    items: [
      { code: "53", name: "GROUND CHAKKAR BIG (25 PCS)", mrp: 525, unit: "1 BOX", discountPrice: 105 },
      { code: "54", name: "GROUND CHAKKAR BIG (10 PCS)", mrp: 225, unit: "1 BOX", discountPrice: 45 },
      { code: "55", name: "GROUND CHAKKAR SPECIAL", mrp: 350, unit: "1 BOX", discountPrice: 70 },
      { code: "56", name: "GROUND CHAKKAR DELUXE", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "57", name: "SPINNER SPECIAL WHEEL", mrp: 850, unit: "1 BOX", discountPrice: 170 },
      { code: "58", name: "SPINNER DELUXE", mrp: 1000, unit: "1 BOX", discountPrice: 200 }
    ],
  },
  {
    name: "ATOM BOMBS",
    items: [
      { code: "59", name: "HYDRO BOMB GREEN", mrp: 450, unit: "1 BOX", discountPrice: 90 },
      { code: "60", name: "KING BOMB GREEN", mrp: 550, unit: "1 BOX", discountPrice: 110 },
      { code: "61", name: "CLASSIC BOMB GREEN", mrp: 700, unit: "1 BOX", discountPrice: 140 },
      { code: "62", name: "BULLET BOMB", mrp: 200, unit: "1 BOX", discountPrice: 40 },
      { code: "63", name: "KING RIDER MEGA DELUXE BOMB", mrp: 1500, unit: "1 BOX", discountPrice: 300 }
    ],
  },
  {
    name: "GLITTERS",
    items: [
      { code: "64", name: "1 1/2\" TWINKLING STAR", mrp: 150, unit: "1 BOX", discountPrice: 30 },
      { code: "65", name: "4\" TWINKLING STAR", mrp: 350, unit: "1 BOX", discountPrice: 70 },
      { code: "66", name: "JIL JILL", mrp: 1500, unit: "1 BOX", discountPrice: 300 }
    ],
  },
  {
    name: "WHISTLING ITEMS",
    items: [
      { code: "67", name: "SIREN (3 PCS)", mrp: 1250, unit: "1 BOX", discountPrice: 250 }
    ],
  },
  {
    name: "SKY SHOWERS",
    items: [
      { code: "68", name: "ASRAFI SMALL (10 PCS)", mrp: 400, unit: "1 BOX", discountPrice: 80 },
      { code: "69", name: "ASRAFI BIG", mrp: 450, unit: "1 BOX", discountPrice: 90 }
    ],
  },
  {
    name: "PAPER BOMB",
    items: [
      { code: "70", name: "ADIYAL - I - 1/4 KG", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "71", name: "ADIYAL - II - 1/2 KG", mrp: 500, unit: "1 BOX", discountPrice: 100 },
      { code: "72", name: "ADIYAL - III - 1 KG", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "73", name: "MAFIA CASINI MONEY COL BOMB (2 PCS)", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "74", name: "MAGIC WANTED COLOUR", mrp: 650, unit: "1 BOX", discountPrice: 130 }
    ],
  },
  {
    name: "SHOWER FOUNTAIN",
    items: [
      { code: "75", name: "SHOWER - 5 IN 1", mrp: 500, unit: "1 BOX", discountPrice: 100 },
      { code: "76", name: "TOP GUN (5 PCS)", mrp: 1250, unit: "1 BOX", discountPrice: 250 }
    ],
  },
  {
    name: "FANCY ITEMS",
    items: [
      { code: "77", name: "7 SHOT (5 PCS)", mrp: 750, unit: "1 BOX", discountPrice: 150 },
      { code: "78", name: "12 SHOT (COLOUR BOMB)", mrp: 1100, unit: "1 BOX", discountPrice: 220 },
      { code: "79", name: "12 SHOT (CRACKLING)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "80", name: "30 SHOT (MULTI COLOUR)", mrp: 2000, unit: "1 BOX", discountPrice: 400 },
      { code: "81", name: "60 SHOT (MULTI COLOUR)", mrp: 4500, unit: "1 BOX", discountPrice: 900 },
      { code: "82", name: "120 SHOT (MULTI COLOUR)", mrp: 9000, unit: "1 BOX", discountPrice: 1800 },
      { code: "83", name: "240 SHOT (MULTI COLOUR)", mrp: 17500, unit: "1 BOX", discountPrice: 3500 }
    ],
  },
  {
    name: "SKY FANCY ITEMS",
    items: [
      { code: "84", name: "CHOTTA FANCY (1 PCE)", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "85", name: "2 1/2\" FANCY (1 PCE)", mrp: 950, unit: "1 BOX", discountPrice: 190 },
      { code: "86", name: "3 1/2\" FANCY", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "87", name: "4\" FANCY SINGLE", mrp: 2100, unit: "1 BOX", discountPrice: 420 },
      { code: "88", name: "4\" FANCY WINDOW (2 PCS)", mrp: 4500, unit: "1 BOX", discountPrice: 900 },
      { code: "89", name: "4\" FANCY DOUBLE BALLS", mrp: 2750, unit: "1 BOX", discountPrice: 550 },
      { code: "90", name: "3 PIECES MULTI COLOUR FANCY", mrp: 1750, unit: "1 BOX", discountPrice: 350 },
      { code: "91", name: "5\" FANCY", mrp: 2750, unit: "1 BOX", discountPrice: 550 }
    ],
  },
  {
    name: "SKY SHOTS",
    items: [
      { code: "92", name: "SKY SHOT GREEN (10 PCS)", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "93", name: "SKY SHOT CRACKLING (10 PCS)", mrp: 900, unit: "1 BOX", discountPrice: 180 }
    ],
  },
  {
    name: "HOLLYWOOD FOUNTAIN",
    items: [
      { code: "94", name: "FOX STAR (RED & GREEN CRACKLING)", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "95", name: "BIG SHOW (1 PCS)", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "96", name: "SING POP (GREEN CRACKLING)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "97", name: "MAGIC PEACOCK (CRACKLING)", mrp: 1100, unit: "1 BOX", discountPrice: 220 },
      { code: "98", name: "BADA MEGA PEACOCK (SILVER CRACKLING) (5 PCS)", mrp: 2000, unit: "1 BOX", discountPrice: 400 },
      { code: "99", name: "PHOTO FLASH RED BLUE GREEN & WHITE", mrp: 600, unit: "1 BOX", discountPrice: 120 },
      { code: "100", name: "BAMBARA", mrp: 600, unit: "1 BOX", discountPrice: 120 },
      { code: "101", name: "DRONE (HELICOPTER FLYING)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "102", name: "EMOJI", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "103", name: "7\" TIN BIG FOUNTAIN", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "104", name: "LIVE SHOW FOUNTAIN", mrp: 900, unit: "1 BOX", discountPrice: 180 }
    ],
  },
  {
    name: "KUITITES ITEMS",
    items: [
      { code: "105", name: "SERPENT EGG", mrp: 150, unit: "1 BOX", discountPrice: 30 },
      { code: "106", name: "MAGIC BUTTERFLY", mrp: 400, unit: "1 BOX", discountPrice: 80 },
      { code: "107", name: "CARTOON", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "108", name: "MIXER COLOUR SHOWER", mrp: 450, unit: "1 BOX", discountPrice: 90 }
    ],
  },
  {
    name: "FANCY MEGA CHAKKAR",
    items: [
      { code: "109", name: "DISCO WHEEL (10 PCS)", mrp: 600, unit: "1 BOX", discountPrice: 120 },
      { code: "110", name: "4 X 4 WHEEL", mrp: 850, unit: "1 BOX", discountPrice: 170 }
    ],
  },
  {
    name: "SPARKLERS",
    items: [
      { code: "111", name: "7CM ELECTRIC SPARKLERS", mrp: 45, unit: "1 BOX", discountPrice: 9 },
      { code: "112", name: "7CM COLOUR SPARKLERS", mrp: 55, unit: "1 BOX", discountPrice: 11 },
      { code: "113", name: "7CM GREEN SPARKLERS", mrp: 65, unit: "1 BOX", discountPrice: 13 },
      { code: "114", name: "7CM RED SPARKLERS", mrp: 75, unit: "1 BOX", discountPrice: 15 },
      { code: "115", name: "10CM ELECTRIC SPARKLERS", mrp: 85, unit: "1 BOX", discountPrice: 17 },
      { code: "116", name: "10CM COLOUR SPARKLERS", mrp: 95, unit: "1 BOX", discountPrice: 19 },
      { code: "117", name: "10CM GREEN SPARKLERS", mrp: 100, unit: "1 BOX", discountPrice: 20 },
      { code: "118", name: "10CM RED SPARKLERS", mrp: 110, unit: "1 BOX", discountPrice: 22 },
      { code: "119", name: "15CM ELECTRIC SPARKLERS", mrp: 175, unit: "1 BOX", discountPrice: 35 },
      { code: "120", name: "15CM COLOUR SPARKLERS", mrp: 190, unit: "1 BOX", discountPrice: 38 },
      { code: "121", name: "15CM GREEN SPARKLERS", mrp: 215, unit: "1 BOX", discountPrice: 43 },
      { code: "122", name: "15CM RED SPARKLERS", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "123", name: "30CM ELECTRIC SPARKLERS", mrp: 175, unit: "1 BOX", discountPrice: 35 },
      { code: "124", name: "30CM COLOUR SPARKLERS", mrp: 190, unit: "1 BOX", discountPrice: 38 },
      { code: "125", name: "30CM GREEN SPARKLERS", mrp: 215, unit: "1 BOX", discountPrice: 43 },
      { code: "126", name: "30CM RED SPARKLERS", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "127", name: "50CM ELECTRIC SPARKLERS", mrp: 850, unit: "1 BOX", discountPrice: 170 },
      { code: "128", name: "50CM COLOUR SPARKLERS", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "129", name: "50CM 5 IN 1 MULTI COLOUR SPARKLERS", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "130", name: "DANCING SPARKLERS", mrp: 1250, unit: "1 BOX", discountPrice: 250 }
    ],
  },
  {
    name: "COLOUR MATCHES",
    items: [
      { code: "131", name: "BIG BOX 10 IN 1 LAPTOP MATCHES", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "132", name: "JACKY JOHN 5 IN 1 MATCHES", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "133", name: "CAP - ROLL", mrp: 250, unit: "1 BOX", discountPrice: 50 },
      { code: "134", name: "ROTAFER GUN", mrp: 650, unit: "1 BOX", discountPrice: 130 },
      { code: "135", name: "ICONE (2 PCS)", mrp: 1400, unit: "1 BOX", discountPrice: 280 }
    ],
  },
  {
    name: "DIFFERENT HI FI FANCY ITEMS",
    items: [
      { code: "136", name: "HELICOPTER (10 PCS)", mrp: 500, unit: "1 BOX", discountPrice: 100 },
      { code: "137", name: "PEACOCK FEATHERS (5 PCS)", mrp: 600, unit: "1 BOX", discountPrice: 120 },
      { code: "138", name: "COLOUR SMOKE (3 PCS)", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "139", name: "OLD IS GOLD", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "140", name: "LOLLY POP", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "141", name: "COCK TAIL (3 PCS)", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "142", name: "6\" WATER QUIN", mrp: 1250, unit: "1 BOX", discountPrice: 180 },
      { code: "143", name: "6\" CRACKLING", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "144", name: "BLACK MONEY (5 PCS)", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "145", name: "DORA", mrp: 900, unit: "1 BOX", discountPrice: 180 },
      { code: "146", name: "MADURAI - MALI", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "147", name: "90 WATS", mrp: 800, unit: "1 BOX", discountPrice: 160 },
      { code: "148", name: "MONEY IN THE BANK", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "149", name: "MONEY STAR", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "150", name: "ONCE MORE", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "151", name: "FLYING MACHINE", mrp: 3000, unit: "1 BOX", discountPrice: 600 },
      { code: "152", name: "LONG WAY", mrp: 3000, unit: "1 BOX", discountPrice: 600 },
      { code: "153", name: "POM POM", mrp: 1250, unit: "1 BOX", discountPrice: 250 },
      { code: "154", name: "COLOUR CONE", mrp: 2500, unit: "1 BOX", discountPrice: 500 },
      { code: "155", name: "YOOGU FOUNTAIN", mrp: 3000, unit: "1 BOX", discountPrice: 600 },
      { code: "156", name: "SUPER STICK", mrp: 3000, unit: "1 BOX", discountPrice: 600 },
      { code: "157", name: "ROBO KIDS (5 PCS)", mrp: 1000, unit: "1 BOX", discountPrice: 200 },
      { code: "158", name: "8\" FOUNTAIN (1 PCE)", mrp: 1500, unit: "1 BOX", discountPrice: 300 },
      { code: "159", name: "WHIZZLING WHEEL (5 PCS)", mrp: 750, unit: "1 BOX", discountPrice: 150 },
      { code: "160", name: "GANGA YAMMUNA (5 PCS)", mrp: 500, unit: "1 BOX", discountPrice: 100 },
      { code: "161", name: "CYLINDER", mrp: 750, unit: "1 BOX", discountPrice: 150 }
    ],
  },
  {
    name: "DIWALI SPECIAL COMBO PACKS",
    items: [
      { code: "FP1", name: "FAMILY PACK ₹3500", mrp: 17500, unit: "1 BOX", discountPrice: 3500 },
      { code: "FP2", name: "FAMILY PACK ₹5000", mrp: 25000, unit: "1 BOX", discountPrice: 5000 },
      { code: "FP3", name: "FAMILY PACK ₹7500", mrp: 37500, unit: "1 BOX", discountPrice: 7500 },
      { code: "FP4", name: "FAMILY PACK ₹10000", mrp: 50000, unit: "1 BOX", discountPrice: 10000 }
    ],
  }
]

