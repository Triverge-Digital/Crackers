import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Sparkles, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Collections - BW Crackers",
  description:
    "Browse our curated collections of premium firecrackers for every celebration.",
}

// Static images for collection cards
const collectionImages = [
  "/images/products/bw-1-2-3-4-kuruvi.jpeg",
  "/images/products/bw-17-baby-rocket.jpeg",
  "/images/products/bw-157-sunrises-22-items.jpeg",
  "/images/products/bw-7-2-sound-crackers.jpeg",
  "/images/products/bw-22-7-magic-pencil.jpeg",
  "/images/products/bw-28-bat-and-ball.jpeg",
  "/images/products/bw-15-red-bijili.jpeg",
  "/images/products/bw-24-ultra-pencil-3pcs.jpeg",
]

const categoryColors = [
  "from-pink-500 to-purple-600",
  "from-orange-500 to-red-600",
  "from-yellow-500 to-orange-500",
  "from-red-500 to-pink-600",
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-indigo-500 to-blue-600",
  "from-amber-500 to-orange-600",
]

const categoryEmojis = [
  "💥",
  "🎊",
  "🎆",
  "🚀",
  "🕯️",
  "✏️",
  "🌙",
  "🎁",
]

export default async function CollectionsPage() {
  const productCategories = await listCategories()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="py-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full mb-6 shadow-xl border-4 border-white/50">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">
              Explore Categories
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg">
            Our Collections
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Browse through our curated collections of premium firecrackers for
            every occasion
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productCategories
              ?.filter((c) => !c.parent_category)
              .map((category, index) => (
                <LocalizedClientLink
                  key={category.id}
                  href={`/categories/${category.handle}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          collectionImages[index % collectionImages.length]
                        }
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-3xl mb-2">
                          {categoryEmojis[index % categoryEmojis.length]}
                        </div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                    </div>
                    <div
                      className={`p-4 bg-gradient-to-r ${categoryColors[index % categoryColors.length]}`}
                    >
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">
                          View Products
                        </span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
          </div>

          {(!productCategories || productCategories.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No collections available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
