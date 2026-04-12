import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto duration-200 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <nav className="content-container flex items-center justify-between gap-6 h-16">
          <div className="flex items-center gap-4">
            <div className="h-full flex items-center small:hidden">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2"
              data-testid="nav-store-link"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
                <span className="text-white text-lg">✨</span>
              </div>
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent font-bold text-xl hidden small:inline">
                BW Crackers
              </span>
            </LocalizedClientLink>
          </div>

          <div className="hidden small:flex items-center gap-6">
            <LocalizedClientLink
              href="/"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Home
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/collections"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Collections
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              All Products
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/about"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              About
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-gray-700 hover:text-orange-600"
                  href="/cart"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
