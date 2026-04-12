import { ArrowRight, Sparkles } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const defaultCollections = [
  {
    name: "Sparklers & Ground Chakkars",
    description: "Perfect for kids and family fun",
    image: "/images/products/product-1.jpeg",
    itemCount: 45,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Aerial Fireworks",
    description: "Spectacular sky shows",
    image: "/images/products/product-17.jpeg",
    itemCount: 67,
    color: "from-blue-500 to-purple-500",
  },
  {
    name: "Festival Combo Packs",
    description: "Complete celebration bundles",
    image: "/images/products/product-33.jpeg",
    itemCount: 32,
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Sound Crackers",
    description: "Loud and exciting celebrations",
    image: "/images/products/product-8.jpeg",
    itemCount: 58,
    color: "from-red-500 to-orange-500",
  },
]

export function CollectionsShowcase({
  collections,
}: {
  collections?: HttpTypes.StoreCollection[]
}) {
  return (
    <section className="py-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full mb-4 shadow-xl border-4 border-white/50">
            <Sparkles className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">
              Explore Categories
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg">
            Our Collections
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Browse through our curated collections of premium firecrackers for
            every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {defaultCollections.map((collection, index) => (
            <LocalizedClientLink
              key={index}
              href="/store"
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-orange-200 rounded-2xl bg-white block"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                  <p className="text-sm text-gray-200 mb-3">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {collection.itemCount} items
                    </span>
                    <span
                      className={`bg-gradient-to-r ${collection.color} hover:opacity-90 group-hover:translate-x-1 transition-transform px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
                    >
                      View <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
