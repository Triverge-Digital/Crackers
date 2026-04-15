"use client"

import { Home, ShoppingBag, List, User, Search } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"
import { clx } from "@medusajs/ui"

const MobileBottomBar = () => {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Shop",
      href: "/store",
      icon: ShoppingBag,
    },
    {
      name: "Search",
      href: "/search",
      icon: Search,
    },
    {
      name: "Pricelist",
      href: "/pricelist",
      icon: List,
    },
    {
      name: "Cart",
      href: "/cart",
      icon: ShoppingBag, // Using ShoppingBag but could be Cart icon
    },
  ]

  return (
    <div className="fixed bottom-0 inset-x-0 z-[150] md:hidden">
      <div className="app-glass border-t border-surface-border px-6 py-3 pb-8 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
          
          return (
            <LocalizedClientLink
              key={item.name}
              href={item.href}
              className={clx(
                "flex flex-col items-center gap-1 transition-all duration-300 relative",
                isActive ? "text-brand-maroon scale-110" : "text-muted"
              )}
            >
              <item.icon size={20} className={clx(isActive ? "stroke-[2.5px]" : "stroke-2")} />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-brand-maroon rounded-full animate-pulse" />
              )}
            </LocalizedClientLink>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomBar
