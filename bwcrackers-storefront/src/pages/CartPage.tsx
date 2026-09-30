import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, CheckCircle2, Truck } from 'lucide-react';
import { MIN_ORDER } from '../constants';
import { useCart } from '../context/CartContext';
import { formatINR, pluralize } from '../lib/format';
import Seo from '../components/ui/Seo';
import ProductThumb from '../components/ui/ProductThumb';
import QtyControl from '../components/ui/QtyControl';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

export default function CartPage() {
  const { lines, totals, removeItem, clearCart, openCheckout } = useCart();

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 md:py-10 pb-32 min-h-[60vh]">
      <Seo title="Your order" description="Review your B&W Crackers order before placing it on WhatsApp." />
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store" className="icon-btn card" aria-label="Back to store"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <div>
          <h1 className="section-title">Your order</h1>
          <p className="text-xs text-gray-500 font-bold">{totals.count ? `${pluralize(totals.count, 'item')} · saving ${formatINR(totals.savings)} vs MRP` : 'Nothing added yet'}</p>
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="card text-center py-16 px-6">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-brand-cream flex items-center justify-center"><ShoppingCart size={36} className="text-brand-magenta" /></div>
          <h2 className="text-xl font-black text-brand-navy mb-2">Your order is empty</h2>
          <p className="text-gray-600 text-sm mb-6">Browse the 2026 price list and tap + on anything you like. Your cart is saved on this device.</p>
          <Link to="/store" className="btn-primary px-8">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_150px_110px_56px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-500 uppercase tracking-wider">
                <span>Product</span><span className="text-center">Qty</span><span className="text-right">Total</span><span className="sr-only">Remove</span>
              </div>
              <ul className="divide-y divide-gray-100">
                {lines.map(({ product: p, qty, lineTotal }) => (
                  <li key={p.code} className="p-4 md:px-5 md:grid md:grid-cols-[1fr_150px_110px_56px] md:gap-4 md:items-center">
                    <div className="flex items-center gap-3 min-w-0">
                      <ProductThumb product={p} className="!w-14 !h-14 !rounded-xl" />
                      <div className="min-w-0">
                        <h3 className="font-black text-sm text-brand-navy leading-tight">{p.name}</h3>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">
                          <Link to={`/store/${p.categorySlug}`} className="hover:text-brand-magenta">{p.categoryName}</Link> · {p.unit} · {formatINR(p.discountPrice)} each
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:contents mt-3 md:mt-0">
                      <div className="md:flex md:justify-center"><QtyControl product={p} /></div>
                      <div className="flex items-center gap-3 md:contents">
                        <p className="font-black text-brand-navy text-right tabular-nums">{formatINR(lineTotal)}</p>
                        <button type="button" onClick={() => removeItem(p.code)} aria-label={`Remove ${p.name}`} className="icon-btn text-gray-400 hover:text-red-600 hover:bg-red-50 min-w-[40px] min-h-[40px]"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-gray-50 border-t border-gray-100">
                <Link to="/store" className="text-xs font-black text-brand-magenta hover:underline">+ Add more items</Link>
                <button type="button" onClick={() => { if (window.confirm('Remove all items from your order?')) clearCart(); }} className="text-xs font-black text-gray-500 hover:text-red-600 min-h-[36px] px-2">Clear order</button>
              </div>
            </div>

            <div className="card p-5 flex gap-4 items-start">
              <div className="w-11 h-11 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center flex-shrink-0"><Truck size={22} /></div>
              <div className="text-sm">
                <p className="font-black text-brand-navy">Transport is paid at the parcel office</p>
                <p className="text-gray-600 mt-0.5">Crackers ship by road in sealed cartons. Transport charges depend on your city and box count and are paid directly to the parcel service on collection. <Link to="/#delivery" className="font-black text-brand-magenta hover:underline">Delivery details</Link></p>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-[120px] card p-6">
            <h2 className="text-sm font-black text-brand-navy uppercase tracking-wider mb-4 pb-3 border-b border-gray-100">Order summary</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-gray-600">MRP total</dt><dd className="text-gray-500 line-through tabular-nums">{formatINR(totals.mrpTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">80% discount</dt><dd className="font-black text-green-700 tabular-nums">− {formatINR(totals.savings)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Items total</dt><dd className="font-black text-brand-navy tabular-nums">{formatINR(totals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Packing fee (2%)</dt><dd className="font-black text-brand-navy tabular-nums">{formatINR(totals.packingFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-600">Transport</dt><dd className="text-gray-500 italic text-xs">Paid at parcel office</dd></div>
            </dl>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
              <span className="font-black text-brand-navy uppercase tracking-wider text-sm">Total to pay</span>
              <span className="text-2xl font-black text-brand-navy tabular-nums">{formatINR(totals.grandTotal)}</span>
            </div>

            {totals.meetsMinimum ? (
              <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 text-xs font-bold text-green-700">
                <CheckCircle2 size={16} /> Minimum order reached
              </div>
            ) : (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-800 font-bold">Add {formatINR(totals.remaining)} more to reach the {formatINR(MIN_ORDER)} minimum</p>
                <div className="w-full bg-amber-100 rounded-full h-1.5 mt-2"><div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${totals.progress}%` }} /></div>
              </div>
            )}

            <button type="button" onClick={openCheckout} disabled={!totals.meetsMinimum} className="btn-whatsapp w-full mt-4 min-h-[52px] text-base">
              <WhatsAppIcon className="w-5 h-5" /> Place order
            </button>
            {!totals.meetsMinimum && <Link to="/store" className="btn-outline w-full mt-2">Continue shopping</Link>}
            <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">You'll enter your delivery details next. Pay by UPI or bank transfer only after we confirm your order.</p>
          </aside>

          {/* Phones: keep the total and the order button in reach while reviewing the list. */}
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-8px_24px_-12px_rgba(26,26,78,0.25)] safe-bottom">
            <div className="flex items-center gap-3 px-4 py-3 max-w-5xl mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">Total to pay</p>
                <p className="text-xl font-black text-brand-navy tabular-nums leading-tight">{formatINR(totals.grandTotal)}</p>
                {!totals.meetsMinimum && <p className="text-[11px] font-bold text-amber-700 truncate">Add {formatINR(totals.remaining)} more</p>}
              </div>
              {totals.meetsMinimum ? (
                <button type="button" onClick={openCheckout} className="btn-whatsapp min-h-[48px] px-5">
                  <WhatsAppIcon className="w-5 h-5" /> Place order
                </button>
              ) : (
                <Link to="/store" className="btn-primary min-h-[48px] px-5">Add more items</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
