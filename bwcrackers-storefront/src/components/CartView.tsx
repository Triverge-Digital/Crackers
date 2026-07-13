import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';
import { pricelist, Product } from '../data/pricelist';
import { MIN_ORDER, FALLBACK_IMG, Totals } from '../constants';
import OrderEnquiryForm from './OrderEnquiryForm';

type CartViewProps = {
  setActiveView: (v: string) => void;
  totals: Totals;
  cart: Record<string, number>;
  setCart: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  updateQty: (code: string, delta: number) => void;
};

export default function CartView({ setActiveView, totals, cart, setCart, updateQty }: CartViewProps) {
  return (
    <motion.div
      key="cart"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-5xl mx-auto w-full min-h-screen p-4 md:p-8 pb-40"
    >
      {/* Cart Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveView('order')}
          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-purple uppercase tracking-tighter">Your Cart</h1>
          <p className="text-xs text-gray-400 font-bold">{totals.count} item{totals.count !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      {totals.count === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart size={40} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-black text-brand-purple mb-2">Your Cart is Empty</h2>
          <p className="text-gray-400 text-sm mb-6">Browse our collection to add items</p>
          <button
            onClick={() => setActiveView('order')}
            className="bg-brand-magenta text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-brand-magenta/90 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left: Cart Items + Form */}
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-[1fr_100px_100px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Product</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Qty</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Price</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider text-center">Remove</span>
              </div>
              <div className="divide-y divide-gray-50">
                {(() => {
                  const cartItems: { product: Product; qty: number; categoryName: string }[] = [];
                  pricelist.forEach(cat => {
                    cat.products.forEach(p => {
                      if (cart[p.code]) {
                        cartItems.push({ product: p, qty: cart[p.code], categoryName: cat.name });
                      }
                    });
                  });
                  return cartItems.map(({ product: p, qty, categoryName }) => (
                    <div key={p.code} className="p-4 md:px-6">
                      {/* Desktop */}
                      <div className="hidden md:grid grid-cols-[1fr_100px_100px_80px] gap-4 items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            {p.showImage === false ? (
                              <div className="w-full h-full bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-black text-lg">{p.name.charAt(0)}</div>
                            ) : (
                              <img src={p.image || FALLBACK_IMG} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-brand-purple uppercase tracking-tight">{p.name}</h4>
                            <span className="text-[10px] text-gray-400 font-bold">{categoryName} · {p.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => updateQty(p.code, -1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-brand-purple font-black text-sm">-</button>
                          <span className="w-6 text-center font-black text-sm">{qty}</span>
                          <button onClick={() => updateQty(p.code, 1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-brand-purple font-black text-sm">+</button>
                        </div>
                        <div className="text-right font-black text-brand-purple">₹{(p.discountPrice * qty).toLocaleString()}</div>
                        <div className="flex justify-center">
                          <button onClick={() => { const newCart = { ...cart }; delete newCart[p.code]; setCart(newCart); }} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {/* Mobile */}
                      <div className="md:hidden flex gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          {p.showImage === false ? (
                            <div className="w-full h-full bg-gradient-to-br from-brand-purple to-brand-magenta flex items-center justify-center text-white font-black text-xl">{p.name.charAt(0)}</div>
                          ) : (
                            <img src={p.image || FALLBACK_IMG} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm text-brand-purple uppercase tracking-tight truncate">{p.name}</h4>
                          <span className="text-[10px] text-gray-400 font-bold">{p.unit}</span>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(p.code, -1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-brand-purple font-black text-sm">-</button>
                              <span className="w-6 text-center font-black text-sm">{qty}</span>
                              <button onClick={() => updateQty(p.code, 1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-brand-purple font-black text-sm">+</button>
                              <button onClick={() => { const newCart = { ...cart }; delete newCart[p.code]; setCart(newCart); }} className="text-gray-300 hover:text-red-500 transition-colors ml-2"><Trash2 size={14} /></button>
                            </div>
                            <span className="font-black text-brand-purple">₹{(p.discountPrice * qty).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Order Enquiry Form */}
            <OrderEnquiryForm cart={cart} totals={totals} pricelist={pricelist} />
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:sticky lg:top-[100px]">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-black text-brand-purple uppercase tracking-wider mb-4 pb-3 border-b border-gray-100 font-display">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal ({totals.count} items)</span>
                  <span className="font-bold text-brand-purple">₹{totals.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Delivery</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-black text-brand-purple uppercase tracking-wider text-sm">Total</span>
                <span className="text-2xl font-black text-brand-purple tracking-tighter">₹{totals.total.toLocaleString()}</span>
              </div>

              {totals.total < MIN_ORDER && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-xs text-red-500 font-bold">Add ₹{(MIN_ORDER - totals.total).toLocaleString()} more to meet minimum order (₹{MIN_ORDER.toLocaleString()})</p>
                  <div className="w-full bg-red-100 rounded-full h-1.5 mt-2">
                    <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (totals.total / MIN_ORDER) * 100)}%` }} />
                  </div>
                </div>
              )}

              {totals.total >= MIN_ORDER && (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span className="text-xs font-bold text-green-600">Minimum order reached!</span>
                </div>
              )}

              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-700 font-bold text-center">Pay in advance via UPI/QR/Bank Transfer, or on delivery</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </motion.div>
  );
}
