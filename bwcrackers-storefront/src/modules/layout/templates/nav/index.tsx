import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-[100] app-glass border-b border-surface-border">
      <header className="relative w-full px-6 md:px-12">
        <nav className="flex items-center justify-between gap-6 h-16 md:h-24">
          <div className="flex items-center gap-8">
            <SideMenu regions={regions} />
            
            <LocalizedClientLink
              href="/"
              className="group flex flex-col items-start"
              data-testid="nav-store-link"
            >
              <div className="flex items-center gap-1">
                <span className="text-brand-carbon font-black text-2xl md:text-3xl tracking-tightest leading-none uppercase">
                   AHAMED
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-brand-maroon mt-1.5"></div>
              </div>
              <span className="text-muted text-[8px] uppercase tracking-[0.4em] font-black leading-none mt-1">
                 Sivakasi Premium
              </span>
            </LocalizedClientLink>
          </div>

          <div className="hidden md:flex items-center gap-12 font-black uppercase tracking-[0.2em] text-[10px]">
            {["Store", "Collections", "Pricelist", "About"].map((item) => (
              <LocalizedClientLink
                key={item}
                href={item === "Pricelist" ? "/pricelist" : `/${item.toLowerCase()}`}
                className="text-secondary hover:text-brand-maroon transition-all relative group"
              >
                {item}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-maroon transition-all group-hover:w-full"></div>
              </LocalizedClientLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <div className="h-10 w-10 rounded-full bg-brand-cloud animate-pulse" />
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
