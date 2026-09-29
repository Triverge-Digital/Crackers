export interface Product {
  code: string;
  name: string;
  unit: string;
  mrp: number;
  discountPrice: number;
  image?: string;
  rating?: number;
  isPremium?: boolean;
  /**
   * When false, the storefront renders this product as a name + price row
   * with NO image. Used for wala / beats crackers that have no photo.
   * Defaults to true (image shown) when omitted.
   */
  showImage?: boolean;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  products: Product[];
}

/** B&W Crackers 2026 price list — 80% discount on MRP. */
export const pricelist: Category[] = [
  {
    id: 1,
    name: "ONE SOUND CRACKERS",
    color: "bg-red-600",
    products: [
      { code: "1", name: "2 1/2\" KURUVI", unit: "1 PKT", mrp: 45, discountPrice: 9, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 5, isPremium: true },
      { code: "2", name: "3 1/2\" LAKSHMI / SPIDERMAN", unit: "1 PKT", mrp: 80, discountPrice: 16, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 4 },
      { code: "3", name: "4\" LAKSHMI", unit: "1 PKT", mrp: 110, discountPrice: 22, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 5, isPremium: true },
      { code: "4", name: "4\" DELUXE LAKSHMI (3 PLY)", unit: "1 PKT", mrp: 150, discountPrice: 30, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 5, isPremium: true },
      { code: "5", name: "4\" GOLD LAKSHMI", unit: "1 PKT", mrp: 210, discountPrice: 42, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 4 },
      { code: "6", name: "5\" MEGA LAKSHMI", unit: "1 PKT", mrp: 210, discountPrice: 42, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 4 },
      { code: "7", name: "2 SOUND CRACKERS", unit: "1 PKT", mrp: 190, discountPrice: 38, image: "/images/products/bw-7-2-sound-crackers.jpeg", rating: 4 },
      { code: "8", name: "MEGA DELUXE LAKSHMI", unit: "1 PKT", mrp: 300, discountPrice: 60, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 5, isPremium: true },
      { code: "9", name: "28 CHORSA", unit: "1 PKT", mrp: 70, discountPrice: 14, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "10", name: "28 GIANT", unit: "1 PKT", mrp: 110, discountPrice: 22, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "11", name: "56 GIANT", unit: "1 PKT", mrp: 220, discountPrice: 44, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 }
    ]
  },
  {
    id: 2,
    name: "DELUXE CRACKERS",
    color: "bg-blue-600",
    products: [
      { code: "12", name: "24 DELUXE CRACKERS", unit: "1 PKT", mrp: 250, discountPrice: 50, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 5, isPremium: true },
      { code: "13", name: "50 DELUXE CRACKERS", unit: "1 PKT", mrp: 750, discountPrice: 150, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 },
      { code: "14", name: "100 WALA DELUXE CRACKERS", unit: "1 PKT", mrp: 1500, discountPrice: 300, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 }
    ]
  },
  {
    id: 3,
    name: "BIJILI CRACKERS",
    color: "bg-green-600",
    products: [
      { code: "15", name: "RED BIJILI", unit: "1 BAG", mrp: 175, discountPrice: 35, image: "/images/products/bw-15-red-bijili.jpeg", rating: 4 },
      { code: "16", name: "STRIPPED BIJILI", unit: "1 BAG", mrp: 190, discountPrice: 38, image: "/images/products/bw-16-stripped-bijili.jpeg", rating: 4 }
    ]
  },
  {
    id: 4,
    name: "ROCKETS",
    color: "bg-purple-600",
    products: [
      { code: "17", name: "BABY ROCKET (10 PCS)", unit: "1 BOX", mrp: 225, discountPrice: 45, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 5, isPremium: true },
      { code: "18", name: "ROCKET BOMB (10 PCS)", unit: "1 BOX", mrp: 375, discountPrice: 75, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "19", name: "LUNIK ROCKET (10 PCS)", unit: "1 BOX", mrp: 750, discountPrice: 150, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "20", name: "MUSICAL ROCKET (10 PCS)", unit: "1 BOX", mrp: 800, discountPrice: 160, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "21", name: "2 SOUND ROCKET", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "CANDLES",
    color: "bg-orange-500",
    products: [
      { code: "22", name: "7\" MAGIC PENCIL", unit: "1 BOX", mrp: 160, discountPrice: 32, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "23", name: "12\" PENCIL", unit: "1 BOX", mrp: 375, discountPrice: 75, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 }
    ]
  },
  {
    id: 6,
    name: "MEGA COLOUR PENCIL",
    color: "bg-pink-600",
    products: [
      { code: "24", name: "ULTRA PENCIL (3 PCS)", unit: "1 BOX", mrp: 400, discountPrice: 80, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 5, isPremium: true },
      { code: "25", name: "POP CORN PENCIL MIXING (5 PCS)", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 4 },
      { code: "26", name: "SELFI STICK (5 PCS)", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-27-selfie-stick-5pcs.jpeg", rating: 4 },
      { code: "27", name: "SIVAKASI PENCIL (2 PCS)", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 4 },
      { code: "28", name: "WATER FULY PENCIL", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 4 },
      { code: "29", name: "POP CORN PENCIL", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 4 }
    ]
  },
  {
    id: 7,
    name: "NIGHT CRACKLING EFFECTS",
    color: "bg-indigo-600",
    products: [
      { code: "30", name: "BAT BALL", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-28-bat-and-ball.jpeg", rating: 4 },
      { code: "31", name: "EMU EGG", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "32", name: "WHITE HOUSE", unit: "1 BOX", mrp: 850, discountPrice: 170, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "33", name: "COLOUR CELEBRATION", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 8,
    name: "BUDGET BEATS",
    color: "bg-yellow-600",
    products: [
      { code: "34", name: "1000 BEATS", unit: "1 BOX", mrp: 850, discountPrice: 170, rating: 4, showImage: false },
      { code: "35", name: "2000 BEATS", unit: "1 BOX", mrp: 1700, discountPrice: 340, rating: 4, showImage: false },
      { code: "36", name: "5000 BEATS", unit: "1 BOX", mrp: 4250, discountPrice: 850, rating: 4, showImage: false },
      { code: "37", name: "10000 BEATS", unit: "1 BOX", mrp: 8500, discountPrice: 1700, rating: 4, showImage: false }
    ]
  },
  {
    id: 9,
    name: "SPECIAL BEATS",
    color: "bg-amber-600",
    products: [
      { code: "38", name: "1000 BEATS", unit: "1 BOX", mrp: 1500, discountPrice: 300, rating: 4, showImage: false },
      { code: "39", name: "2000 BEATS", unit: "1 BOX", mrp: 3500, discountPrice: 700, rating: 4, showImage: false },
      { code: "40", name: "5000 BEATS", unit: "1 BOX", mrp: 7500, discountPrice: 1500, rating: 4, showImage: false },
      { code: "41", name: "10000 BEATS", unit: "1 BOX", mrp: 15000, discountPrice: 3000, rating: 5, isPremium: true, showImage: false }
    ]
  },
  {
    id: 10,
    name: "FLOWER POTS",
    color: "bg-teal-600",
    products: [
      { code: "42", name: "FLOWER POTS SMALL", unit: "1 BOX", mrp: 300, discountPrice: 60, image: "/images/products/bw-30-tim-tam.jpeg", rating: 4 },
      { code: "43", name: "FLOWER POTS BIG", unit: "1 BOX", mrp: 425, discountPrice: 85, image: "/images/products/bw-30-tim-tam.jpeg", rating: 4 },
      { code: "44", name: "FLOWER POTS SPECIAL", unit: "1 BOX", mrp: 550, discountPrice: 110, image: "/images/products/bw-30-tim-tam.jpeg", rating: 4 },
      { code: "45", name: "FLOWER POTS ASOKA", unit: "1 BOX", mrp: 750, discountPrice: 150, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "46", name: "FLOWER POTS DELUXE (5 PCS)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "47", name: "FLOWER POTS SUPER DELUXE (2 PCS)", unit: "1 BOX", mrp: 700, discountPrice: 140, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "48", name: "COLOUR KOTI (10 PCS)", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "49", name: "COLOUR KOTI DELUXE (10 PCS)", unit: "1 BOX", mrp: 1750, discountPrice: 350, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 5, isPremium: true },
      { code: "50", name: "MEGA COLOUR KOTI DELUXE OR COLOUR CONE (10 PCS)", unit: "1 BOX", mrp: 2500, discountPrice: 500, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 5, isPremium: true },
      { code: "51", name: "TRI COLOUR FOUNTAIN", unit: "1 BOX", mrp: 1750, discountPrice: 350, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "52", name: "GYPSY WINDOW POWER POTS (500 PCS)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-30-tim-tam.jpeg", rating: 4 }
    ]
  },
  {
    id: 11,
    name: "GROUND CHAKKARS",
    color: "bg-rose-600",
    products: [
      { code: "53", name: "GROUND CHAKKAR BIG (25 PCS)", unit: "1 BOX", mrp: 525, discountPrice: 105, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 4 },
      { code: "54", name: "GROUND CHAKKAR BIG (10 PCS)", unit: "1 BOX", mrp: 225, discountPrice: 45, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 4 },
      { code: "55", name: "GROUND CHAKKAR SPECIAL", unit: "1 BOX", mrp: 350, discountPrice: 70, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 4 },
      { code: "56", name: "GROUND CHAKKAR DELUXE", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 4 },
      { code: "57", name: "SPINNER SPECIAL WHEEL", unit: "1 BOX", mrp: 850, discountPrice: 170, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 },
      { code: "58", name: "SPINNER DELUXE", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 }
    ]
  },
  {
    id: 12,
    name: "ATOM BOMBS",
    color: "bg-red-700",
    products: [
      { code: "59", name: "HYDRO BOMB GREEN", unit: "1 BOX", mrp: 450, discountPrice: 90, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "60", name: "KING BOMB GREEN", unit: "1 BOX", mrp: 550, discountPrice: 110, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "61", name: "CLASSIC BOMB GREEN", unit: "1 BOX", mrp: 700, discountPrice: 140, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "62", name: "BULLET BOMB", unit: "1 BOX", mrp: 200, discountPrice: 40, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "63", name: "KING RIDER MEGA DELUXE BOMB", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 13,
    name: "GLITTERS",
    color: "bg-cyan-600",
    products: [
      { code: "64", name: "1 1/2\" TWINKLING STAR", unit: "1 BOX", mrp: 150, discountPrice: 30, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "65", name: "4\" TWINKLING STAR", unit: "1 BOX", mrp: 350, discountPrice: 70, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "66", name: "JIL JILL", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 }
    ]
  },
  {
    id: 14,
    name: "WHISTLING ITEMS",
    color: "bg-violet-600",
    products: [
      { code: "67", name: "SIREN (3 PCS)", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 }
    ]
  },
  {
    id: 15,
    name: "SKY SHOWERS",
    color: "bg-sky-600",
    products: [
      { code: "68", name: "ASRAFI SMALL (10 PCS)", unit: "1 BOX", mrp: 400, discountPrice: 80, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "69", name: "ASRAFI BIG", unit: "1 BOX", mrp: 450, discountPrice: 90, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 }
    ]
  },
  {
    id: 16,
    name: "PAPER BOMB",
    color: "bg-orange-700",
    products: [
      { code: "70", name: "ADIYAL - I - 1/4 KG", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "71", name: "ADIYAL - II - 1/2 KG", unit: "1 BOX", mrp: 500, discountPrice: 100, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "72", name: "ADIYAL - III - 1 KG", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "73", name: "MAFIA CASINI MONEY COL BOMB (2 PCS)", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 5, isPremium: true },
      { code: "74", name: "MAGIC WANTED COLOUR", unit: "1 BOX", mrp: 650, discountPrice: 130, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 }
    ]
  },
  {
    id: 17,
    name: "SHOWER FOUNTAIN",
    color: "bg-lime-600",
    products: [
      { code: "75", name: "SHOWER - 5 IN 1", unit: "1 BOX", mrp: 500, discountPrice: 100, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "76", name: "TOP GUN (5 PCS)", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 18,
    name: "FANCY ITEMS",
    color: "bg-fuchsia-600",
    products: [
      { code: "77", name: "7 SHOT (5 PCS)", unit: "1 BOX", mrp: 750, discountPrice: 150, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "78", name: "12 SHOT (COLOUR BOMB)", unit: "1 BOX", mrp: 1100, discountPrice: 220, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "79", name: "12 SHOT (CRACKLING)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "80", name: "30 SHOT (MULTI COLOUR)", unit: "1 BOX", mrp: 2000, discountPrice: 400, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 4 },
      { code: "81", name: "60 SHOT (MULTI COLOUR)", unit: "1 BOX", mrp: 4500, discountPrice: 900, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "82", name: "120 SHOT (MULTI COLOUR)", unit: "1 BOX", mrp: 9000, discountPrice: 1800, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "83", name: "240 SHOT (MULTI COLOUR)", unit: "1 BOX", mrp: 17500, discountPrice: 3500, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 19,
    name: "SKY FANCY ITEMS",
    color: "bg-blue-700",
    products: [
      { code: "84", name: "CHOTTA FANCY (1 PCE)", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 4 },
      { code: "85", name: "2 1/2\" FANCY (1 PCE)", unit: "1 BOX", mrp: 950, discountPrice: 190, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "86", name: "3 1/2\" FANCY", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 4 },
      { code: "87", name: "4\" FANCY SINGLE", unit: "1 BOX", mrp: 2100, discountPrice: 420, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 4 },
      { code: "88", name: "4\" FANCY WINDOW (2 PCS)", unit: "1 BOX", mrp: 4500, discountPrice: 900, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "89", name: "4\" FANCY DOUBLE BALLS", unit: "1 BOX", mrp: 2750, discountPrice: 550, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "90", name: "3 PIECES MULTI COLOUR FANCY", unit: "1 BOX", mrp: 1750, discountPrice: 350, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "91", name: "5\" FANCY", unit: "1 BOX", mrp: 2750, discountPrice: 550, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 20,
    name: "SKY SHOTS",
    color: "bg-emerald-600",
    products: [
      { code: "92", name: "SKY SHOT GREEN (10 PCS)", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 },
      { code: "93", name: "SKY SHOT CRACKLING (10 PCS)", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 }
    ]
  },
  {
    id: 21,
    name: "HOLLYWOOD FOUNTAIN",
    color: "bg-stone-600",
    products: [
      { code: "94", name: "FOX STAR (RED & GREEN CRACKLING)", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "95", name: "BIG SHOW (1 PCS)", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "96", name: "SING POP (GREEN CRACKLING)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "97", name: "MAGIC PEACOCK (CRACKLING)", unit: "1 BOX", mrp: 1100, discountPrice: 220, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "98", name: "BADA MEGA PEACOCK (SILVER CRACKLING) (5 PCS)", unit: "1 BOX", mrp: 2000, discountPrice: 400, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 5, isPremium: true },
      { code: "99", name: "PHOTO FLASH RED BLUE GREEN & WHITE", unit: "1 BOX", mrp: 600, discountPrice: 120, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "100", name: "BAMBARA", unit: "1 BOX", mrp: 600, discountPrice: 120, image: "/images/products/bw-30-tim-tam.jpeg", rating: 4 },
      { code: "101", name: "DRONE (HELICOPTER FLYING)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 4 },
      { code: "102", name: "EMOJI", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "103", name: "7\" TIN BIG FOUNTAIN", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "104", name: "LIVE SHOW FOUNTAIN", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-31-white-house.jpeg", rating: 4 }
    ]
  },
  {
    id: 22,
    name: "KUITITES ITEMS",
    color: "bg-pink-700",
    products: [
      { code: "105", name: "SERPENT EGG", unit: "1 BOX", mrp: 150, discountPrice: 30, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "106", name: "MAGIC BUTTERFLY", unit: "1 BOX", mrp: 400, discountPrice: 80, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "107", name: "CARTOON", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "108", name: "MIXER COLOUR SHOWER", unit: "1 BOX", mrp: 450, discountPrice: 90, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 }
    ]
  },
  {
    id: 23,
    name: "FANCY MEGA CHAKKAR",
    color: "bg-yellow-700",
    products: [
      { code: "109", name: "DISCO WHEEL (10 PCS)", unit: "1 BOX", mrp: 600, discountPrice: 120, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 },
      { code: "110", name: "4 X 4 WHEEL", unit: "1 BOX", mrp: 850, discountPrice: 170, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 }
    ]
  },
  {
    id: 24,
    name: "SPARKLERS",
    color: "bg-yellow-500",
    products: [
      { code: "111", name: "7CM ELECTRIC SPARKLERS", unit: "1 BOX", mrp: 45, discountPrice: 9, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "112", name: "7CM COLOUR SPARKLERS", unit: "1 BOX", mrp: 55, discountPrice: 11, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "113", name: "7CM GREEN SPARKLERS", unit: "1 BOX", mrp: 65, discountPrice: 13, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "114", name: "7CM RED SPARKLERS", unit: "1 BOX", mrp: 75, discountPrice: 15, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "115", name: "10CM ELECTRIC SPARKLERS", unit: "1 BOX", mrp: 85, discountPrice: 17, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 },
      { code: "116", name: "10CM COLOUR SPARKLERS", unit: "1 BOX", mrp: 95, discountPrice: 19, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 },
      { code: "117", name: "10CM GREEN SPARKLERS", unit: "1 BOX", mrp: 100, discountPrice: 20, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 },
      { code: "118", name: "10CM RED SPARKLERS", unit: "1 BOX", mrp: 110, discountPrice: 22, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 },
      { code: "119", name: "15CM ELECTRIC SPARKLERS", unit: "1 BOX", mrp: 175, discountPrice: 35, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 4 },
      { code: "120", name: "15CM COLOUR SPARKLERS", unit: "1 BOX", mrp: 190, discountPrice: 38, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 4 },
      { code: "121", name: "15CM GREEN SPARKLERS", unit: "1 BOX", mrp: 215, discountPrice: 43, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 4 },
      { code: "122", name: "15CM RED SPARKLERS", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 4 },
      { code: "123", name: "30CM ELECTRIC SPARKLERS", unit: "1 BOX", mrp: 175, discountPrice: 35, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 4 },
      { code: "124", name: "30CM COLOUR SPARKLERS", unit: "1 BOX", mrp: 190, discountPrice: 38, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 4 },
      { code: "125", name: "30CM GREEN SPARKLERS", unit: "1 BOX", mrp: 215, discountPrice: 43, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 4 },
      { code: "126", name: "30CM RED SPARKLERS", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 4 },
      { code: "127", name: "50CM ELECTRIC SPARKLERS", unit: "1 BOX", mrp: 850, discountPrice: 170, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 4 },
      { code: "128", name: "50CM COLOUR SPARKLERS", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 4 },
      { code: "129", name: "50CM 5 IN 1 MULTI COLOUR SPARKLERS", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 5, isPremium: true },
      { code: "130", name: "DANCING SPARKLERS", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-27-selfie-stick-5pcs.jpeg", rating: 5, isPremium: true }
    ]
  },
  {
    id: 25,
    name: "COLOUR MATCHES",
    color: "bg-stone-700",
    products: [
      { code: "131", name: "BIG BOX 10 IN 1 LAPTOP MATCHES", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-157-sunrises-22-items.jpeg", rating: 4 },
      { code: "132", name: "JACKY JOHN 5 IN 1 MATCHES", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-158-royal-king-26-items.jpeg", rating: 4 },
      { code: "133", name: "CAP - ROLL", unit: "1 BOX", mrp: 250, discountPrice: 50, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "134", name: "ROTAFER GUN", unit: "1 BOX", mrp: 650, discountPrice: 130, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "135", name: "ICONE (2 PCS)", unit: "1 BOX", mrp: 1400, discountPrice: 280, image: "/images/products/bw-159-mumbai-indians-31-items.jpeg", rating: 4 }
    ]
  },
  {
    id: 26,
    name: "DIFFERENT HI FI FANCY ITEMS",
    color: "bg-purple-700",
    products: [
      { code: "136", name: "HELICOPTER (10 PCS)", unit: "1 BOX", mrp: 500, discountPrice: 100, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 4 },
      { code: "137", name: "PEACOCK FEATHERS (5 PCS)", unit: "1 BOX", mrp: 600, discountPrice: 120, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "138", name: "COLOUR SMOKE (3 PCS)", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "139", name: "OLD IS GOLD", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-157-sunrises-22-items.jpeg", rating: 4 },
      { code: "140", name: "LOLLY POP", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "141", name: "COCK TAIL (3 PCS)", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-158-royal-king-26-items.jpeg", rating: 4 },
      { code: "142", name: "6\" WATER QUIN", unit: "1 BOX", mrp: 1250, discountPrice: 180, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "143", name: "6\" CRACKLING", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "144", name: "BLACK MONEY (5 PCS)", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-159-mumbai-indians-31-items.jpeg", rating: 4 },
      { code: "145", name: "DORA", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "146", name: "MADURAI - MALI", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-160-chennai-super-kings-42-items.jpeg", rating: 4 },
      { code: "147", name: "90 WATS", unit: "1 BOX", mrp: 800, discountPrice: 160, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 },
      { code: "148", name: "MONEY IN THE BANK", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-159-mumbai-indians-31-items.jpeg", rating: 4 },
      { code: "149", name: "MONEY STAR", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-157-sunrises-22-items.jpeg", rating: 4 },
      { code: "150", name: "ONCE MORE", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-158-royal-king-26-items.jpeg", rating: 4 },
      { code: "151", name: "FLYING MACHINE", unit: "1 BOX", mrp: 3000, discountPrice: 600, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 5, isPremium: true },
      { code: "152", name: "LONG WAY", unit: "1 BOX", mrp: 3000, discountPrice: 600, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "153", name: "POM POM", unit: "1 BOX", mrp: 1250, discountPrice: 250, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "154", name: "COLOUR CONE", unit: "1 BOX", mrp: 2500, discountPrice: 500, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "155", name: "YOOGU FOUNTAIN", unit: "1 BOX", mrp: 3000, discountPrice: 600, image: "/images/products/bw-31-white-house.jpeg", rating: 5, isPremium: true },
      { code: "156", name: "SUPER STICK", unit: "1 BOX", mrp: 3000, discountPrice: 600, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 5, isPremium: true },
      { code: "157", name: "ROBO KIDS (5 PCS)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-29-emu-egg.jpeg", rating: 4 },
      { code: "158", name: "8\" FOUNTAIN (1 PCE)", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-31-white-house.jpeg", rating: 4 },
      { code: "159", name: "WHIZZLING WHEEL (5 PCS)", unit: "1 BOX", mrp: 750, discountPrice: 150, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 },
      { code: "160", name: "GANGA YAMMUNA (5 PCS)", unit: "1 BOX", mrp: 500, discountPrice: 100, image: "/images/products/bw-32-color-celebrate-5pcs.jpeg", rating: 4 },
      { code: "161", name: "CYLINDER", unit: "1 BOX", mrp: 750, discountPrice: 150, image: "/images/products/bw-31-white-house.jpeg", rating: 4 }
    ]
  },
  {
    id: 27,
    name: "DIWALI SPECIAL COMBO PACKS",
    color: "bg-fuchsia-700",
    products: [
      { code: "FP1", name: "FAMILY PACK ₹3500", unit: "1 BOX", mrp: 17500, discountPrice: 3500, image: "/images/products/bw-157-sunrises-22-items.jpeg", rating: 5, isPremium: true },
      { code: "FP2", name: "FAMILY PACK ₹5000", unit: "1 BOX", mrp: 25000, discountPrice: 5000, image: "/images/products/bw-158-royal-king-26-items.jpeg", rating: 5, isPremium: true },
      { code: "FP3", name: "FAMILY PACK ₹7500", unit: "1 BOX", mrp: 37500, discountPrice: 7500, image: "/images/products/bw-160-chennai-super-kings-42-items.jpeg", rating: 5, isPremium: true },
      { code: "FP4", name: "FAMILY PACK ₹10000", unit: "1 BOX", mrp: 50000, discountPrice: 10000, image: "/images/products/bw-161-andal-nachiyar-51-items.jpeg", rating: 5, isPremium: true }
    ]
  }
];

