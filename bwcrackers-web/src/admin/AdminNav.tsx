'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, FolderTree, Images, Settings, LogOut, ExternalLink } from 'lucide-react';
import { signOut } from './actions/auth';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/photos', label: 'Photos', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
// Phones get the four most used sections in a bottom bar; the rest live under "More".
const MOBILE = ['/admin', '/admin/orders', '/admin/products', '/admin/customers'];

export default function AdminNav({ adminName, newOrders }: { adminName: string; newOrders: number }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="print:hidden hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col bg-brand-navy text-white">
        <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <img src="/logo.webp" alt="" className="h-9 w-auto" />
          <span className="font-extrabold leading-tight">B&amp;W Crackers<span className="block text-xs font-bold text-white/60">Shop admin</span></span>
        </Link>
        <nav className="flex-1 p-3 space-y-1" aria-label="Admin">
          {ITEMS.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 min-h-[44px] text-sm font-bold transition-colors ${active(href, exact) ? 'bg-white text-brand-navy' : 'text-white/80 hover:bg-white/10'}`}
            >
              <Icon size={18} /> {label}
              {href === '/admin/orders' && newOrders > 0 && (
                <span className="ml-auto rounded-full bg-brand-magenta text-white text-[11px] font-extrabold px-2 py-0.5">{newOrders}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 min-h-[40px] text-sm font-bold text-white/70 hover:bg-white/10">
            <ExternalLink size={16} /> View website
          </a>
          <form action={signOut}>
            <button type="submit" className="w-full flex items-center gap-3 rounded-xl px-3 min-h-[40px] text-sm font-bold text-white/70 hover:bg-white/10">
              <LogOut size={16} /> Sign out
            </button>
          </form>
          <p className="px-3 pt-1 text-xs text-white/40 truncate">{adminName}</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="print:hidden lg:hidden sticky top-0 z-30 flex items-center justify-between bg-brand-navy text-white px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2 font-extrabold">
          <img src="/logo.webp" alt="" className="h-8 w-auto" /> Admin
        </Link>
        <div className="flex items-center gap-1">
          <a href="/" target="_blank" aria-label="View website" className="p-2.5 rounded-lg hover:bg-white/10"><ExternalLink size={18} /></a>
          <form action={signOut}><button type="submit" aria-label="Sign out" className="p-2.5 rounded-lg hover:bg-white/10"><LogOut size={18} /></button></form>
        </div>
      </header>

      {/* Mobile bottom bar */}
      <nav className="print:hidden lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]" aria-label="Admin">
        {ITEMS.filter(i => MOBILE.includes(i.href)).map(({ href, label, icon: Icon, exact }) => (
          <Link key={href} href={href} className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[58px] text-[11px] font-bold ${active(href, exact) ? 'text-brand-magenta' : 'text-gray-500'}`}>
            <Icon size={20} /> {label}
            {href === '/admin/orders' && newOrders > 0 && (
              <span className="absolute top-1.5 right-[22%] rounded-full bg-brand-magenta text-white text-[10px] font-extrabold px-1.5">{newOrders}</span>
            )}
          </Link>
        ))}
        <details className="relative">
          <summary className={`list-none flex flex-col items-center justify-center gap-0.5 min-h-[58px] text-[11px] font-bold cursor-pointer ${ITEMS.some(i => !MOBILE.includes(i.href) && active(i.href)) ? 'text-brand-magenta' : 'text-gray-500'}`}>
            <Settings size={20} /> More
          </summary>
          <div className="absolute bottom-full right-2 mb-2 w-48 bg-white rounded-2xl border border-gray-200 shadow-xl p-2">
            {ITEMS.filter(i => !MOBILE.includes(i.href)).map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 min-h-[44px] text-sm font-bold text-gray-800 hover:bg-gray-50">
                <Icon size={18} /> {label}
              </Link>
            ))}
          </div>
        </details>
      </nav>
    </>
  );
}
