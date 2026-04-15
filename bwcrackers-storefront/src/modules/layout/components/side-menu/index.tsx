"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"
import { Menu, Home, Grid, List, Info, Phone, Mail, Instagram } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Collections", href: "/collections", icon: Grid },
  { name: "Store", href: "/store", icon: List },
  { name: "Pricelist", href: "/pricelist", icon: List },
  { name: "About Us", href: "/about", icon: Info },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none text-brand-carbon hover:text-brand-maroon"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-surface-border flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                    <Menu size={18} />
                  </div>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[150] bg-brand-carbon/30 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-500"
                enterFrom="opacity-0 -translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-300"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
              >
                <PopoverPanel className="fixed inset-y-0 left-0 w-full sm:w-[450px] z-[200] outline-none">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-brand-cloud border-r border-surface-border p-8 lg:p-12 relative overflow-hidden"
                  >
                    <div className="bg-noise absolute inset-0 pointer-events-none opacity-5"></div>
                    
                    <div className="flex justify-between items-center mb-16 relative z-10" id="xmark">
                      <div className="flex flex-col items-start leading-none">
                        <div className="flex items-center gap-1">
                          <span className="text-brand-carbon font-black text-3xl tracking-tightest uppercase">
                             AHAMED
                          </span>
                          <div className="h-2 w-2 rounded-full bg-brand-maroon mt-2"></div>
                        </div>
                        <span className="text-muted text-[10px] uppercase tracking-[0.4em] font-black mt-2">
                           Premium Sivakasi
                        </span>
                      </div>
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="h-12 w-12 rounded-full bg-white flex items-center justify-center border border-surface-border text-brand-carbon hover:rotate-90 transition-all duration-500 shadow-sm"
                      >
                        <XMark />
                      </button>
                    </div>

                    <ul className="flex flex-col gap-4 items-start justify-start flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                      {SideMenuItems.map((item, i) => {
                        return (
                          <li key={item.name} className="w-full">
                            <LocalizedClientLink
                              href={item.href}
                              className="w-full flex items-center justify-between p-5 rounded-3xl border border-transparent hover:border-surface-border hover:bg-white transition-all group shadow-none hover:shadow-xl hover:shadow-brand-maroon/5"
                              onClick={close}
                              data-testid={`${item.name.toLowerCase()}-link`}
                            >
                              <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-2xl bg-white border border-surface-border flex items-center justify-center group-hover:bg-brand-maroon group-hover:text-white transition-colors shadow-sm">
                                  <item.icon size={20} />
                                </div>
                                <span className="text-2xl font-black text-brand-carbon group-hover:text-brand-maroon transition-colors uppercase tracking-tightest">
                                    {item.name}
                                </span>
                              </div>
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="flex flex-col gap-y-10 mt-auto pt-10 border-t border-surface-border relative z-10">
                      <div className="flex justify-center gap-8">
                        {[
                          { icon: Instagram, href: "#" },
                          { icon: Phone, href: "#" },
                          { icon: Mail, href: "#" },
                        ].map((social, i) => (
                          <a key={i} href={social.href} className="p-4 rounded-full bg-white border border-surface-border hover:border-brand-maroon hover:text-brand-maroon transition-all shadow-sm">
                            <social.icon size={18} />
                          </a>
                        ))}
                      </div>

                      <div className="text-center">
                        <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                          © {new Date().getFullYear()} AHAMED CRACKERS
                        </p>
                        <div className="h-px w-12 bg-surface-border mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
