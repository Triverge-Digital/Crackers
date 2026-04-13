import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4">
      <header className="relative w-full max-w-7xl glass-card rounded-full px-6 py-2 border border-white/20 shadow-premium">
        <nav className="flex items-center justify-between gap-6 h-12 md:h-14">
          <div className="flex items-center gap-4">
            <div className="h-full flex items-center small:hidden">
              <SideMenu regions={regions} />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 group transition-transform hover:scale-105"
              data-testid="nav-store-link"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold-400 via-brand-accent-orange to-brand-accent-hot shadow-glow-gold animate-sparkle">
                <span className="text-white text-lg drop-shadow-md">✨</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-gold font-black text-xl md:text-2xl font-serif tracking-tight">
                  B&W
                </span>
                <span className="text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Crackers
                </span>
              </div>
            </LocalizedClientLink>
          </div>

          <div className="hidden small:flex items-center gap-8">
            {["Home", "Collections", "Store", "About"].map((item) => (
              <LocalizedClientLink
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-white/80 hover:text-brand-gold-400 transition-all font-bold text-sm uppercase tracking-wider relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold-400 transition-all group-hover:w-full rounded-full shadow-glow-gold"></span>
              </LocalizedClientLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <div className="h-10 w-10 rounded-full glass-gold animate-pulse" />
              }
            >
              <div className="bg-brand-gold-400/10 hover:bg-brand-gold-400/20 p-1.5 rounded-full transition-colors border border-brand-gold-400/20">
                <CartButton />
              </div>
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
