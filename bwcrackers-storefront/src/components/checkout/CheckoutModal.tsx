import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, User, MapPin, Mail, ChevronDown, Download, CheckCircle2, AlertTriangle, PackageSearch, Loader2 } from 'lucide-react';
import { MIN_ORDER } from '../../constants';
import { useCart } from '../../context/CartContext';
import { createOrderEnquiry, sendConfirmationEmail, CustomerDetails } from '../../lib/api';
import { formatINR, pluralize } from '../../lib/format';
import { buildWhatsAppOrderUrl, buildPaymentShareWhatsAppUrl } from '../../lib/whatsappOrder';
import type { EstimatePdf } from '../../lib/generateEstimatePDF';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import PaymentDetails from './PaymentDetails';

type Step = 'details' | 'done';
type Errors = Partial<Record<keyof CustomerDetails, string>>;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function localReference() {
  return `#BW${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, lines, totals, customer, setCustomer, clearCart } = useCart();
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>('details');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [itemsExpanded, setItemsExpanded] = useState(false);
  const [result, setResult] = useState<{ reference: string; saved: boolean; waUrl: string; grandTotal: number; packingFee: number; subtotal: number } | null>(null);
  const [pdf, setPdf] = useState<EstimatePdf | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [waOpened, setWaOpened] = useState(false);

  // Snapshot of lines at the time of ordering so the "done" screen stays stable.
  const orderedLines = useRef(lines);

  useEffect(() => {
    if (!checkoutOpen) return;
    document.body.style.overflow = 'hidden';
    const first = dialogRef.current?.querySelector<HTMLElement>('input, button');
    window.setTimeout(() => first?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); handleClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(n => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutOpen, step]);

  const handleClose = () => {
    closeCheckout();
    window.setTimeout(() => { setStep('details'); setErrors({}); setPdf(null); setResult(null); setWaOpened(false); setItemsExpanded(false); }, 350);
  };

  const finish = () => {
    clearCart();
    handleClose();
  };

  const field = (name: keyof CustomerDetails) => ({
    name,
    value: customer[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCustomer(prev => ({ ...prev, [name]: e.target.value }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    },
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    className: `input ${errors[name] ? 'input-error' : ''}`,
  });

  const validate = (): boolean => {
    const e: Errors = {};
    if (customer.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^[6-9]\d{9}$/.test(customer.phone.trim())) e.phone = 'Enter a valid 10-digit Indian mobile number';
    if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) e.email = 'Enter a valid email or leave it blank';
    if (customer.address.trim().length < 8) e.address = 'Enter your full delivery address (street, area, landmark)';
    if (!/^\d{6}$/.test(customer.pincode.trim())) e.pincode = 'Enter a 6-digit pincode';
    setErrors(e);
    const firstError = Object.keys(e)[0];
    if (firstError) dialogRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
    return !firstError;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totals.meetsMinimum || !validate() || submitting) return;
    setSubmitting(true);
    orderedLines.current = lines;

    // Open the tab synchronously so mobile browsers don't treat the later
    // navigation as a blocked popup.
    const waWindow = window.open('', '_blank');

    let reference = localReference();
    let saved = false;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 9000);
      const res = await createOrderEnquiry(lines, customer, controller.signal);
      window.clearTimeout(timeout);
      if (res.reference) { reference = res.reference; saved = true; }
    } catch {
      // Backend unreachable — the WhatsApp message still carries the full order.
    }

    const fullAddress = [customer.address, customer.city, customer.state, customer.pincode].map(s => s.trim()).filter(Boolean).join(', ');
    const waUrl = buildWhatsAppOrderUrl(lines, totals.subtotal, totals.packingFee, { name: customer.name.trim(), phone: customer.phone.trim(), address: fullAddress }, reference);

    if (waWindow) {
      waWindow.location.href = waUrl;
      setWaOpened(true);
    }

    setResult({ reference, saved, waUrl, grandTotal: totals.grandTotal, packingFee: totals.packingFee, subtotal: totals.subtotal });
    setStep('done');
    setSubmitting(false);

    // Estimate PDF + confirmation email in the background.
    void buildPdf(reference, fullAddress).then(generated => {
      sendConfirmationEmail({
        customer: { name: customer.name.trim(), phone: customer.phone.trim(), email: customer.email.trim(), address: fullAddress },
        items: lines.map(l => ({ name: l.product.name, unit: l.product.unit, qty: l.qty, price: l.product.discountPrice, total: l.lineTotal })),
        itemsTotal: totals.subtotal,
        packingFee: totals.packingFee,
        grandTotal: totals.grandTotal,
        reference,
        pdfBase64: generated?.base64,
        pdfFilename: generated?.filename,
      });
    });
  };

  const buildPdf = async (reference: string, fullAddress: string): Promise<EstimatePdf | null> => {
    setPdfBusy(true);
    try {
      const { generateEstimatePDF } = await import('../../lib/generateEstimatePDF');
      const snapshot = orderedLines.current;
      const subtotal = snapshot.reduce((s, l) => s + l.lineTotal, 0);
      const packingFee = Math.ceil(subtotal * 0.02);
      const generated = await generateEstimatePDF(
        snapshot,
        { name: customer.name.trim(), phone: customer.phone.trim(), email: customer.email.trim(), address: fullAddress },
        reference.replace(/^#/, ''),
        subtotal,
        packingFee,
        subtotal + packingFee,
      );
      setPdf(generated);
      return generated;
    } catch {
      return null;
    } finally {
      setPdfBusy(false);
    }
  };

  const downloadPdf = async () => {
    const { downloadEstimatePdf } = await import('../../lib/generateEstimatePDF');
    if (pdf) { downloadEstimatePdf(pdf); return; }
    if (!result) return;
    const fullAddress = [customer.address, customer.city, customer.state, customer.pincode].map(s => s.trim()).filter(Boolean).join(', ');
    const generated = await buildPdf(result.reference, fullAddress);
    if (generated) downloadEstimatePdf(generated);
  };

  const summaryLines = useMemo(() => (step === 'done' ? orderedLines.current : lines), [step, lines]);
  const visibleLines = itemsExpanded ? summaryLines : summaryLines.slice(0, 4);

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-brand-ink/60 z-[90] backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[100] sm:px-4 pointer-events-none"
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkout-title"
              className="pointer-events-auto bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] flex flex-col overflow-hidden"
            >
              <div className="bg-brand-navy px-5 sm:px-6 py-4 flex items-center justify-between gap-3 flex-shrink-0">
                <div>
                  <h2 id="checkout-title" className="text-white font-black text-lg leading-tight">
                    {step === 'details' ? 'Place your order' : result?.saved ? 'Order received' : 'Order ready to send'}
                  </h2>
                  <p className="text-white/70 text-xs mt-0.5">
                    {step === 'details' ? `${pluralize(totals.count, 'item')} · ${formatINR(totals.grandTotal)} incl. packing` : 'Next: send on WhatsApp, then pay after confirmation'}
                  </p>
                </div>
                <button type="button" onClick={handleClose} aria-label="Close" className="icon-btn bg-white/10 hover:bg-white/20 text-white rounded-full min-w-[40px] min-h-[40px]">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {step === 'details' && (
                  <form onSubmit={handleOrder} noValidate className="px-5 sm:px-6 pt-4 pb-6 space-y-5">
                    {/* Order summary */}
                    <section className="border border-gray-100 rounded-2xl overflow-hidden" aria-label="Order summary">
                      <div className="bg-brand-navy/5 px-4 py-2 flex items-center justify-between">
                        <p className="text-xs font-black text-brand-navy uppercase tracking-widest">Your order · {pluralize(summaryLines.length, 'item')}</p>
                        <Link to="/cart" onClick={handleClose} className="text-xs font-black text-brand-magenta hover:underline">Edit</Link>
                      </div>
                      <ul className="divide-y divide-gray-50">
                        {visibleLines.map(l => (
                          <li key={l.product.code} className="flex items-center justify-between px-4 py-2 text-sm">
                            <span className="min-w-0 pr-3">
                              <span className="block font-bold text-brand-navy truncate">{l.product.name}</span>
                              <span className="block text-xs text-gray-500">{l.product.unit} × {l.qty}</span>
                            </span>
                            <span className="font-black text-brand-navy tabular-nums">{formatINR(l.lineTotal)}</span>
                          </li>
                        ))}
                      </ul>
                      {summaryLines.length > 4 && (
                        <button type="button" onClick={() => setItemsExpanded(v => !v)} className="w-full flex items-center justify-center gap-1 py-2 text-xs font-black text-brand-magenta hover:bg-gray-50" aria-expanded={itemsExpanded}>
                          {itemsExpanded ? 'Show fewer' : `Show all ${summaryLines.length} items`} <ChevronDown size={14} className={itemsExpanded ? 'rotate-180' : ''} />
                        </button>
                      )}
                      <dl className="bg-gray-50 px-4 py-3 space-y-1.5 border-t border-gray-100 text-sm">
                        <div className="flex justify-between"><dt className="text-gray-600">Items total</dt><dd className="font-black text-brand-navy">{formatINR(totals.subtotal)}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-600">You save vs MRP</dt><dd className="font-black text-green-700">{formatINR(totals.savings)}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-600">Packing fee (2%)</dt><dd className="font-black text-brand-navy">{formatINR(totals.packingFee)}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-600">Transport</dt><dd className="text-gray-500 italic text-xs">Paid at parcel office</dd></div>
                        <div className="border-t border-gray-200 pt-1.5 flex justify-between text-base"><dt className="font-black text-brand-navy">Total to pay</dt><dd className="font-black text-green-700">{formatINR(totals.grandTotal)}</dd></div>
                      </dl>
                    </section>

                    {!totals.meetsMinimum && (
                      <div role="alert" className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <AlertTriangle className="text-amber-600 flex-shrink-0" size={20} />
                        <div className="text-sm">
                          <p className="font-black text-amber-800">Add {formatINR(totals.remaining)} more to place this order</p>
                          <p className="text-amber-800/80 text-xs mt-0.5">Our minimum order is {formatINR(MIN_ORDER)} so parcel transport stays economical for you.</p>
                          <Link to="/store" onClick={handleClose} className="btn-outline mt-3 min-h-[40px] text-xs">Continue shopping</Link>
                        </div>
                      </div>
                    )}

                    <fieldset className="space-y-4" disabled={!totals.meetsMinimum}>
                      <legend className="sr-only">Your details</legend>
                      <div>
                        <label htmlFor="name" className="label">Your name <span className="text-red-500" aria-hidden="true">*</span></label>
                        <div className="relative">
                          <input id="name" type="text" autoComplete="name" placeholder="e.g. Ravi Kumar" required {...field('name')} />
                          <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                        {errors.name && <p id="name-error" className="text-xs text-red-600 font-medium mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label htmlFor="phone" className="label">Mobile number <span className="text-red-500" aria-hidden="true">*</span></label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-bold text-sm">+91</span>
                          <input
                            id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" maxLength={10} required
                            {...field('phone')}
                            onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setCustomer(p => ({ ...p, phone: v })); setErrors(p => ({ ...p, phone: undefined })); }}
                            className={`input rounded-l-none ${errors.phone ? 'input-error' : ''}`}
                          />
                        </div>
                        {errors.phone && <p id="phone-error" className="text-xs text-red-600 font-medium mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label htmlFor="address" className="label">Delivery address <span className="text-red-500" aria-hidden="true">*</span></label>
                        <div className="relative">
                          <textarea id="address" rows={2} autoComplete="street-address" placeholder="House / street, area, landmark" required {...field('address')} className={`input resize-none pr-10 ${errors.address ? 'input-error' : ''}`} />
                          <MapPin size={16} className="absolute right-3.5 top-3.5 text-gray-300 pointer-events-none" />
                        </div>
                        {errors.address && <p id="address-error" className="text-xs text-red-600 font-medium mt-1">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1.2fr_1fr_0.9fr] gap-3">
                        <div>
                          <label htmlFor="city" className="label">City</label>
                          <input id="city" type="text" autoComplete="address-level2" placeholder="City / town" {...field('city')} />
                        </div>
                        <div>
                          <label htmlFor="state" className="label">State</label>
                          <input id="state" type="text" autoComplete="address-level1" placeholder="State" {...field('state')} />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <label htmlFor="pincode" className="label">Pincode <span className="text-red-500" aria-hidden="true">*</span></label>
                          <input
                            id="pincode" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="6 digits" maxLength={6} required
                            {...field('pincode')}
                            onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 6); setCustomer(p => ({ ...p, pincode: v })); setErrors(p => ({ ...p, pincode: undefined })); }}
                          />
                          {errors.pincode && <p id="pincode-error" className="text-xs text-red-600 font-medium mt-1">{errors.pincode}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="label">Email <span className="text-gray-400 font-medium normal-case tracking-normal">(optional — for your estimate copy)</span></label>
                        <div className="relative">
                          <input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
                          <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        </div>
                        {errors.email && <p id="email-error" className="text-xs text-red-600 font-medium mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label htmlFor="notes" className="label">Notes <span className="text-gray-400 font-medium normal-case tracking-normal">(optional)</span></label>
                        <textarea id="notes" rows={2} placeholder="Preferred delivery date, alternate number, anything we should know" {...field('notes')} className="input resize-none" />
                      </div>
                    </fieldset>

                    <button type="submit" disabled={submitting || !totals.meetsMinimum} className="btn-whatsapp w-full min-h-[52px] text-base">
                      {submitting ? (<><Loader2 className="animate-spin" size={20} /> Placing order…</>) : (<><WhatsAppIcon className="w-5 h-5" /> Place order on WhatsApp</>)}
                    </button>
                    <p className="text-xs text-center text-gray-500 leading-relaxed">
                      We save your order and open WhatsApp with the details pre-filled. Pay only after we confirm availability.
                    </p>
                  </form>
                )}

                {step === 'done' && result && (
                  <div className="px-5 sm:px-6 pt-4 pb-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex gap-3 items-start">
                      <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={22} />
                      <div className="text-sm">
                        <p className="text-green-800 font-black">{result.saved ? 'Your order is saved with us.' : 'Your order is ready to send.'}</p>
                        <p className="text-green-700 text-xs mt-0.5">
                          {waOpened
                            ? 'WhatsApp opened in a new tab — tap Send there to complete your order.'
                            : 'Tap the button below to send your order to us on WhatsApp.'}
                        </p>
                      </div>
                    </div>

                    <a href={result.waUrl} target="_blank" rel="noopener noreferrer" onClick={() => setWaOpened(true)} className={`w-full ${waOpened ? 'btn-outline' : 'btn-whatsapp'} min-h-[50px]`}>
                      <WhatsAppIcon className="w-5 h-5" /> {waOpened ? 'Open WhatsApp again' : 'Send order on WhatsApp'}
                    </a>

                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={downloadPdf} disabled={pdfBusy} className="btn-navy min-h-[46px] text-xs sm:text-sm">
                        {pdfBusy ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />} Estimate PDF
                      </button>
                      <Link to={`/track?ref=${encodeURIComponent(result.reference.replace(/^#/, ''))}`} onClick={finish} className="btn-outline min-h-[46px] text-xs sm:text-sm">
                        <PackageSearch size={16} /> Track order
                      </Link>
                    </div>

                    <PaymentDetails
                      referenceNumber={result.reference}
                      itemsTotal={result.subtotal}
                      packingFee={result.packingFee}
                      amountToPay={result.grandTotal}
                      whatsappShareUrl={buildPaymentShareWhatsAppUrl(result.reference, result.grandTotal)}
                    />

                    <button type="button" onClick={finish} className="btn-outline w-full">Done — clear my cart</button>
                    <p className="text-xs text-center text-gray-500">Closing with ✕ keeps your cart so you can come back to it.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
