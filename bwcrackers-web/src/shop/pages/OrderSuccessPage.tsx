'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Copy, Download, PackageSearch, Phone, ShoppingBag, ChevronDown, Loader2, MapPin, ClipboardCheck, IndianRupee, Truck } from 'lucide-react';
import { useCatalog, useShopConstants } from '../context/ShopContext';
import { formatINR, pluralize } from '../lib/format';
import { buildPaymentShareWhatsAppUrl } from '../lib/whatsappOrder';
import { loadLastOrder, PlacedOrder } from '../lib/lastOrder';
import type { EstimatePdf } from '../lib/generateEstimatePDF';
import ProductThumb from '../components/ui/ProductThumb';
import PaymentDetails from '../components/checkout/PaymentDetails';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

export default function OrderSuccessPage() {
  const { CONTACT, DELIVERY_INFO, PRIMARY_PHONE_INTL, WHATSAPP_LINK } = useShopConstants();
  const { cartLines } = useCatalog();
  // Read from sessionStorage after mount so the server render and first client render agree.
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setOrder(loadLastOrder()); setLoaded(true); }, []);
  const lines = useMemo(() => (order ? cartLines(order.items) : []), [order, cartLines]);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [pdf, setPdf] = useState<EstimatePdf | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  const buildPdf = async (): Promise<EstimatePdf | null> => {
    if (!order) return null;
    setPdfBusy(true);
    try {
      const { generateEstimatePDF } = await import('../lib/generateEstimatePDF');
      const generated = await generateEstimatePDF(lines, order.customer, order.reference.replace(/^#/, ''), order.subtotal, order.packingFee, order.grandTotal);
      setPdf(generated);
      return generated;
    } catch {
      return null;
    } finally {
      setPdfBusy(false);
    }
  };

  if (!loaded) return <div className="min-h-[60vh]" aria-busy="true" />;

  if (!order) {
    return (
      <div className="max-w-lg mx-auto w-full px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white flex items-center justify-center shadow-card"><ShoppingBag className="text-brand-magenta" size={28} /></div>
        <h1 className="section-title mb-2">No recent order here</h1>
        <p className="text-gray-600 text-sm mb-6">Placed an order earlier? Track it with your order reference and mobile number.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/track" className="btn-navy"><PackageSearch size={16} /> Track an order</Link>
          <Link href="/store" className="btn-primary">Browse the price list</Link>
        </div>
      </div>
    );
  }

  const ref = order.reference;
  const firstName = order.customer.name.split(' ')[0];
  const viaWhatsApp = order.channel === 'whatsapp';
  const placed = new Date(order.placedAt);
  const placedLabel = placed.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

  const copyRef = () => {
    navigator.clipboard?.writeText(ref).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 2000); });
  };

  const downloadPdf = async () => {
    const { downloadEstimatePdf } = await import('../lib/generateEstimatePDF');
    const file = pdf ?? (await buildPdf());
    if (file) downloadEstimatePdf(file);
  };

  const steps = [
    { icon: ClipboardCheck, title: 'We confirm your order', desc: `Our team will call or WhatsApp you on +91 ${order.customer.phone} to confirm stock — usually within a few hours.` },
    { icon: IndianRupee, title: 'You pay after confirmation', desc: `Pay ${formatINR(order.grandTotal)} by UPI or bank transfer and quote your order reference ${ref}.` },
    { icon: Truck, title: 'We pack & dispatch', desc: `Dispatch in ${DELIVERY_INFO.dispatchWindow}. Transport is paid at the parcel office on delivery.` },
  ];

  return (
    <div className="w-full pb-24">

      {/* Confirmation hero */}
      <section className="bg-gradient-to-b from-brand-navy to-[#2D1B6B] text-white px-4 pt-10 pb-24 md:pt-14 md:pb-28 text-center">
        <motion.div
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-5"
        >
          <span className="absolute inset-0 rounded-full bg-green-400/25 motion-safe:animate-ping" style={{ animationIterationCount: 2 }} aria-hidden="true" />
          <span className="relative flex w-full h-full rounded-full bg-green-500 items-center justify-center shadow-[0_10px_40px_rgba(34,197,94,0.5)]">
            <Check size={44} strokeWidth={3.5} />
          </span>
        </motion.div>
        <motion.div initial={reduce ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <p className="text-green-300 text-xs font-black uppercase tracking-[3px] mb-2">{viaWhatsApp ? 'Order sent' : 'Order successful'}</p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight">Thank you, {firstName}!</h1>
          <p className="text-white/75 text-sm md:text-base mt-2 max-w-md mx-auto">
            {viaWhatsApp
              ? 'Your order is in WhatsApp — make sure you pressed Send so it reaches us.'
              : 'We have received your order. A confirmation is on its way.'}
          </p>
        </motion.div>
      </section>

      <div className="max-w-2xl mx-auto px-4 -mt-16 md:-mt-20 space-y-4">
        {/* Reference card */}
        <div className="card p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Order reference</p>
              <p className="text-2xl md:text-3xl font-black text-brand-navy tracking-wide mt-1">{ref}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{placedLabel} · {pluralize(lines.length, 'item')}</p>
            </div>
            <button type="button" onClick={copyRef} className="btn-outline min-h-[40px] px-3 text-xs flex-shrink-0" aria-label="Copy order reference">
              {copied ? <><Check size={14} className="text-green-600" /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Amount to pay after confirmation</p>
              <p className="text-3xl font-black text-green-700 tabular-nums mt-1">{formatINR(order.grandTotal)}</p>
            </div>
            <p className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full px-3 py-1 whitespace-nowrap">You saved {formatINR(order.savings)}</p>
          </div>
          {viaWhatsApp && order.whatsappUrl && (
            <a href={order.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mt-5">
              <WhatsAppIcon className="w-5 h-5" /> Open WhatsApp again
            </a>
          )}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="btn-navy min-h-[46px] text-xs sm:text-sm">
              {pdfBusy ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} Estimate PDF
            </button>
            <Link href={`/track?ref=${encodeURIComponent(ref.replace(/^#/, ''))}`} className="btn-outline min-h-[46px] text-xs sm:text-sm">
              <PackageSearch size={16} /> Track order
            </Link>
          </div>
        </div>

        {/* What happens next */}
        <div className="card p-5 md:p-6">
          <h2 className="text-sm font-black text-brand-navy uppercase tracking-wider mb-4">What happens next</h2>
          <ol className="relative space-y-5">
            <span className="absolute left-[19px] top-3 bottom-3 w-px bg-gray-200" aria-hidden="true" />
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="relative flex gap-4">
                <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-brand-magenta text-white shadow-lg shadow-brand-magenta/30' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                  <Icon size={18} />
                </span>
                <div className="pt-1.5">
                  <p className={`font-black text-sm ${i === 0 ? 'text-brand-navy' : 'text-gray-700'}`}>{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Order summary */}
        <div className="card overflow-hidden">
          <button type="button" onClick={() => setShowItems(v => !v)} aria-expanded={showItems} className="w-full flex items-center justify-between gap-3 px-5 md:px-6 py-4 hover:bg-gray-50">
            <span className="text-sm font-black text-brand-navy uppercase tracking-wider">Order summary · {pluralize(lines.length, 'item')}</span>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${showItems ? 'rotate-180' : ''}`} />
          </button>
          {showItems && (
            <ul className="divide-y divide-gray-100 border-t border-gray-100">
              {lines.map(l => (
                <li key={l.product.code} className="flex items-center gap-3 px-5 md:px-6 py-3">
                  <ProductThumb product={l.product} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-brand-navy leading-snug">{l.product.name}</p>
                    <p className="text-xs text-gray-500">{l.product.unit} × {l.qty} · {formatINR(l.product.discountPrice)} each</p>
                  </div>
                  <p className="font-black text-sm text-brand-navy tabular-nums">{formatINR(l.lineTotal)}</p>
                </li>
              ))}
            </ul>
          )}
          <dl className="bg-gray-50 px-5 md:px-6 py-4 space-y-2 border-t border-gray-100 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600">Items total</dt><dd className="font-black text-brand-navy tabular-nums">{formatINR(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">Packing fee (2%)</dt><dd className="font-black text-brand-navy tabular-nums">{formatINR(order.packingFee)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">Transport</dt><dd className="text-gray-500 italic text-xs">Paid at parcel office</dd></div>
            <div className="flex justify-between pt-2 border-t border-gray-200 text-base"><dt className="font-black text-brand-navy">Total</dt><dd className="font-black text-green-700 tabular-nums">{formatINR(order.grandTotal)}</dd></div>
          </dl>
        </div>

        {/* Delivery details */}
        <div className="card p-5 md:p-6 flex gap-4">
          <span className="w-10 h-10 rounded-xl bg-brand-magenta/10 text-brand-magenta flex items-center justify-center flex-shrink-0"><MapPin size={20} /></span>
          <div className="text-sm min-w-0">
            <p className="font-black text-brand-navy">Delivering to {order.customer.name}</p>
            <p className="text-gray-600 mt-0.5 break-words">{order.customer.address}</p>
            <p className="text-gray-600 mt-0.5">+91 {order.customer.phone}{order.customer.email ? ` · ${order.customer.email}` : ''}</p>
          </div>
        </div>

        {/* Payment details, for after confirmation */}
        <div className="card overflow-hidden">
          <button type="button" onClick={() => setShowPayment(v => !v)} aria-expanded={showPayment} className="w-full flex items-center justify-between gap-3 px-5 md:px-6 py-4 hover:bg-gray-50 text-left">
            <span>
              <span className="block text-sm font-black text-brand-navy uppercase tracking-wider">Payment details</span>
              <span className="block text-xs text-gray-500 mt-0.5">Pay only after we confirm your order</span>
            </span>
            <ChevronDown size={18} className={`text-gray-400 transition-transform flex-shrink-0 ${showPayment ? 'rotate-180' : ''}`} />
          </button>
          {showPayment && (
            <div className="px-5 md:px-6 pb-5 border-t border-gray-100 pt-4">
              <PaymentDetails
                referenceNumber={ref}
                itemsTotal={order.subtotal}
                packingFee={order.packingFee}
                amountToPay={order.grandTotal}
                whatsappShareUrl={buildPaymentShareWhatsAppUrl(ref, order.grandTotal)}
              />
            </div>
          )}
        </div>

        {/* Help + continue */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">Questions about your order?</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <a href={`tel:+${PRIMARY_PHONE_INTL}`} className="btn-outline min-h-[42px] text-xs"><Phone size={15} /> +91 {CONTACT.primaryPhone}</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline min-h-[42px] text-xs"><WhatsAppIcon className="w-4 h-4 text-brand-whatsapp" /> Chat with us</a>
          </div>
          <Link href="/" className="btn-primary mt-6 px-8">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}
