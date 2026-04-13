"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

import { ShoppingBag } from "lucide-react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full outline-none">
          <LocalizedClientLink
            className="group relative flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-full glass-gold border border-brand-gold-400/20 hover:border-brand-gold-400/50 transition-all shadow-glow-gold/10"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <ShoppingBag className="h-5 w-5 text-brand-gold-400 group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-brand-accent-hot text-[10px] font-black text-white shadow-lg border border-white/20 animate-sparkle">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
              static
              className="hidden small:block absolute top-[calc(100%+12px)] right-0 w-[420px] bg-brand-royal-950 border border-white/10 rounded-[2rem] shadow-glow-gold/10 overflow-hidden backdrop-blur-xl z-[100]"
              data-testid="nav-cart-dropdown"
            >
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h3 className="text-[10px] font-black text-brand-gold-400 uppercase tracking-[0.4em]">Your Collection</h3>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[450px] px-8 py-8 grid grid-cols-1 gap-y-10 no-scrollbar relative z-10">
                   {/* Subtle background glow */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[100px_1fr] gap-x-6 group"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-full aspect-square glass-card rounded-2xl overflow-hidden border border-white/5 relative"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between py-1">
                          <div className="flex flex-col gap-y-2">
                             <div className="flex items-start justify-between gap-4">
                                <h3 className="text-white font-bold text-sm tracking-tight leading-snug group-hover:text-gold transition-colors">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <div className="text-gold font-bold text-sm">
                                  <LineItemPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                </div>
                             </div>
                             
                             <div className="flex flex-col gap-y-1">
                                <LineItemOptions
                                  variant={item.variant}
                                  className="text-[10px] text-white/30 uppercase tracking-widest font-black"
                                  data-testid="cart-item-variant"
                                />
                                <div className="text-[10px] text-white/50 font-bold">
                                  Qty: {item.quantity}
                                </div>
                             </div>
                          </div>
                          
                          <div className="flex justify-end pt-2">
                            <DeleteButton
                              id={item.id}
                              className="text-[10px] text-white/20 hover:text-brand-accent-hot transition-colors uppercase font-black tracking-widest"
                              data-testid="cart-item-remove-button"
                            >
                              Relinquish
                            </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-10 bg-white/5 border-t border-white/5 flex flex-col gap-y-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-[0.3em] block mb-1">
                        Subtotal
                      </span>
                      <span className="text-white/20 text-[9px] uppercase font-bold tracking-widest">
                        Inclusive of all local taxes
                      </span>
                    </div>
                    <span
                      className="text-3xl font-black text-white font-serif tracking-tighter"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-y-4">
                    <LocalizedClientLink href="/cart" passHref>
                      <button
                        className="premium-btn w-full h-16 text-lg tracking-[0.2em]"
                        data-testid="go-to-cart-button"
                      >
                        Finalize Order
                      </button>
                    </LocalizedClientLink>
                    <button
                      onClick={close}
                      className="w-full text-[10px] text-white/20 hover:text-white uppercase font-black tracking-[0.3em] transition-colors"
                    >
                      Continue Curating
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-20 text-center">
                 <div className="w-20 h-20 glass- gold mx-auto mb-8 rounded-3xl flex items-center justify-center border border-white/5 bg-white/5">
                   <div className="text-3xl">👝</div>
                 </div>
                 <h3 className="text-white font-black text-xl mb-4 tracking-tight">Your Trove is Empty</h3>
                 <p className="text-white/30 text-sm font-light leading-relaxed mb-10 max-w-[240px] mx-auto">
                   Discover our exclusive seasonal collections and start your legacy today.
                 </p>
                 <LocalizedClientLink href="/store">
                    <button onClick={close} className="ghost-gold px-10 py-4 uppercase text-[10px] font-black tracking-[0.2em]">
                      Explore Collections
                    </button>
                 </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
