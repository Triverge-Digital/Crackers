import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-16">
      <div className="content-container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <LocalizedClientLink href="/" className="block">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                BW Crackers
              </h3>
            </LocalizedClientLink>
            <p className="text-gray-400 text-sm">
              Light up your celebrations with our premium quality firecrackers.
              Quality guaranteed with 100% safety certification.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <LocalizedClientLink
                  href="/"
                  className="hover:text-orange-400 transition-colors"
                >
                  Home
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-orange-400 transition-colors"
                >
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/collections"
                  className="hover:text-orange-400 transition-colors"
                >
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/about"
                  className="hover:text-orange-400 transition-colors"
                >
                  About
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/cart"
                  className="hover:text-orange-400 transition-colors"
                >
                  Cart
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {productCategories?.slice(0, 6).map((c) => {
                if (c.parent_category) return null
                return (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                )
              })}
              {(!productCategories || productCategories.length === 0) && (
                <>
                  <li className="hover:text-orange-400 cursor-pointer">
                    Sparklers
                  </li>
                  <li className="hover:text-orange-400 cursor-pointer">
                    Aerial Fireworks
                  </li>
                  <li className="hover:text-orange-400 cursor-pointer">
                    Sound Crackers
                  </li>
                  <li className="hover:text-orange-400 cursor-pointer">
                    Combo Packs
                  </li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@bwcrackers.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: Sivakasi, Tamil Nadu, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BW Crackers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
