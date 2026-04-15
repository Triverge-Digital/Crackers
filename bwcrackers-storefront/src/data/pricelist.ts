export interface Product {
  code: string;
  name: string;
  unit: string;
  mrp: number;
  discountPrice: number;
  image?: string;
  rating?: number;
  isPremium?: boolean;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  products: Product[];
}

export const pricelist: Category[] = [
  {
    id: 1,
    name: "SINGLE SOUND CRACKERS",
    color: "bg-red-600",
    products: [
      { code: "1", name: "2 3/4\" KURUVI", unit: "1 PKT", mrp: 40, discountPrice: 8, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4, isPremium: true },
      { code: "2", name: "3 1/2\" LAKSHMI", unit: "1 PKT", mrp: 80, discountPrice: 16, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "3", name: "4\" LAKSHMI", unit: "1 PKT", mrp: 100, discountPrice: 20, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 5, isPremium: true },
      { code: "4", name: "4\" DELUXE LAKSHMI", unit: "1 PKT", mrp: 150, discountPrice: 30, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 5, isPremium: true },
      { code: "5", name: "4\" GOLD LAKSHMI", unit: "1 PKT", mrp: 175, discountPrice: 35, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 5 },
      { code: "6", name: "5\" MEGA LAKSHMI", unit: "1 PKT", mrp: 190, discountPrice: 38, image: "/images/products/bw-3-4-lakshmi.jpeg", rating: 5 },
      { code: "7", name: "2 SOUND CRACKERS", unit: "1 PKT", mrp: 175, discountPrice: 35, image: "/images/products/bw-7-2-sound-crackers.jpeg", rating: 5 },
      { code: "8", name: "ELEPHANT CRACKERS", unit: "1 PKT", mrp: 250, discountPrice: 50, image: "/images/products/bw-8-elephant-crackers.jpeg", rating: 4 },
      { code: "9", name: "28 CHORSA", unit: "1 PKT", mrp: 70, discountPrice: 14, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "10", name: "28 GIANT", unit: "1 PKT", mrp: 120, discountPrice: 24, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 },
      { code: "11", name: "56 GIANT", unit: "1 PKT", mrp: 200, discountPrice: 40, image: "/images/products/bw-1-2-3-4-kuruvi.jpeg", rating: 4 }
    ]
  },
  {
    id: 2,
    name: "DELUXE CRACKER",
    color: "bg-blue-600",
    products: [
      { code: "12", name: "24 DELUXE", unit: "1 PKT", mrp: 250, discountPrice: 50, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 5, isPremium: true },
      { code: "13", name: "50 DELUXE", unit: "1 PKT", mrp: 500, discountPrice: 100, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 4 },
      { code: "14", name: "100 DELUXE", unit: "1 PKT", mrp: 1100, discountPrice: 220, image: "/images/products/bw-12-24-deluxe.jpeg", rating: 5 }
    ]
  },
  {
    id: 3,
    name: "BIJILI CRACKERS",
    color: "bg-green-600",
    products: [
      { code: "15", name: "RED BIJILI", unit: "1 PKT", mrp: 160, discountPrice: 32, image: "/images/products/bw-15-red-bijili.jpeg", rating: 4 },
      { code: "16", name: "STRIPPED BIJILI", unit: "1 PKT", mrp: 170, discountPrice: 34, image: "/images/products/bw-16-stripped-bijili.jpeg", rating: 4 }
    ]
  },
  {
    id: 4,
    name: "ROCKETS",
    color: "bg-purple-600",
    products: [
      { code: "17", name: "BABY ROCKET", unit: "1 BOX", mrp: 300, discountPrice: 60, image: "/images/products/bw-17-baby-rocket.jpeg", rating: 5, isPremium: true },
      { code: "18", name: "ROCKET BOMB", unit: "1 BOX", mrp: 450, discountPrice: 90, image: "/images/products/bw-18-rocket-bomb.jpeg", rating: 4 },
      { code: "19", name: "LUNIK ROCKET", unit: "1 BOX", mrp: 700, discountPrice: 140, image: "/images/products/bw-19-lunik-rocket.jpeg", rating: 5 },
      { code: "20", name: "MUSICAL ROCKET", unit: "1 BOX", mrp: 900, discountPrice: 180, image: "/images/products/bw-20-musical-rocket.jpeg", rating: 5, isPremium: true },
      { code: "21", name: "2SOUND ROCKET", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-21-2-sound-rocket.jpeg", rating: 4 }
    ]
  },
  {
    id: 5,
    name: "CANDLES",
    color: "bg-orange-600",
    products: [
      { code: "22", name: "7\" MAGIC PENCIL", unit: "1 BOX", mrp: 125, discountPrice: 25, image: "/images/products/bw-22-7-magic-pencil.jpeg", rating: 4 },
      { code: "23", name: "12\" PENCIL", unit: "1 BOX", mrp: 275, discountPrice: 55, image: "/images/products/bw-23-12-pencil.jpeg", rating: 4 }
    ]
  },
  {
    id: 6,
    name: "COLOR PENCIL",
    color: "bg-pink-600",
    products: [
      { code: "24", name: "ULTRA PENCIL (3PCS)", unit: "1 BOX", mrp: 400, discountPrice: 80, image: "/images/products/bw-24-ultra-pencil-3pcs.jpeg", rating: 5, isPremium: true },
      { code: "25", name: "NAVARAG PENCIL (5PCS)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-25-navarag-pencil-5pcs.jpeg", rating: 5 },
      { code: "26", name: "POPCORN PENCIL (5PCS)", unit: "1 BOX", mrp: 1200, discountPrice: 240, image: "/images/products/bw-26-popcorn-pencil-5pcs.jpeg", rating: 4 },
      { code: "27", name: "SELFIE STICK (5PCS)", unit: "1 BOX", mrp: 1000, discountPrice: 200, image: "/images/products/bw-27-selfie-stick-5pcs.jpeg", rating: 5 }
    ]
  },
  {
    id: 7,
    name: "PREMIUM GIFT BOXES",
    color: "bg-indigo-600",
    products: [
      { code: "157", name: "SUNRISES (22 ITEMS)", unit: "1 BOX", mrp: 1500, discountPrice: 300, image: "/images/products/bw-157-sunrises-22-items.jpeg", rating: 5, isPremium: true },
      { code: "158", name: "ROYAL KING (26 ITEMS)", unit: "1 BOX", mrp: 1900, discountPrice: 380, image: "/images/products/bw-158-royal-king-26-items.jpeg", rating: 4, isPremium: true },
      { code: "159", name: "MUMBAI INDIANS (31 ITEMS)", unit: "1 BOX", mrp: 2400, discountPrice: 480, image: "/images/products/bw-159-mumbai-indians-31-items.jpeg", rating: 5, isPremium: true },
      { code: "160", name: "CHENNAI SUPER KINGS (42 ITEM)", unit: "1 BOX", mrp: 3500, discountPrice: 690, image: "/images/products/bw-160-chennai-super-kings-42-items.jpeg", rating: 5, isPremium: true },
      { code: "161", name: "ANDAL NACHIYAR (51 ITEMS)", unit: "1 BOX", mrp: 4500, discountPrice: 890, image: "/images/products/bw-161-andul-nachiyar-51-items.jpeg", rating: 5, isPremium: true }
    ]
  }
];
