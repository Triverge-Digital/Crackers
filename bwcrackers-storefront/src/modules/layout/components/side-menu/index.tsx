"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"

const SideMenuItems = {
  Home: "/",
  Collections: "/collections",
  "All Products": "/store",
  About: "/about",
  Cart: "/cart",
}

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
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
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
                <PopoverPanel className="fixed inset-y-0 left-0 w-full sm:w-[480px] z-[100] outline-none">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-brand-royal-950/90 backdrop-blur-3xl border-r border-white/5 p-12 lg:p-20 relative overflow-hidden"
                  >
                     {/* Decorative background pulse */}
                    <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-24" id="xmark">
                      <div className="flex flex-col leading-none">
                        <span className="text-gold font-black text-2xl font-serif tracking-tight">
                          B&W
                        </span>
                        <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-bold">
                          Navigation
                        </span>
                      </div>
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="h-12 w-12 rounded-full glass-gold flex items-center justify-center border border-brand-gold-400/20 text-brand-gold-400 hover:scale-110 transition-transform"
                      >
                        <XMark />
                      </button>
                    </div>

                    <ul className="flex flex-col gap-10 items-start justify-start flex-1">
                      {Object.entries(SideMenuItems).map(([name, href], i) => {
                        return (
                          <li key={name} className="animate-fade-in-right" style={{ animationDelay: `${i * 100}ms` }}>
                            <LocalizedClientLink
                              href={href}
                              className="text-4xl lg:text-5xl font-black text-white/40 hover:text-gold transition-all font-serif tracking-tighter flex items-center gap-6 group"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              <span className="text-gold text-lg lg:text-xl italic opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all font-sans">0{i+1}</span>
                              {name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="flex flex-col gap-y-12">
                      <div
                        className="flex justify-between items-center group cursor-pointer"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-300 text-brand-gold-400",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      
                      <div className="pt-8 border-t border-white/5 space-y-2">
                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                          © {new Date().getFullYear()} B&W Crackers. 
                        </p>
                        <p className="text-white/10 text-[9px] uppercase font-bold tracking-[0.2em]">
                          The Art of Celestial Celebration.
                        </p>
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
