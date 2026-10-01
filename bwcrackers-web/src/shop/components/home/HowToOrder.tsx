'use client';

import Link from 'next/link';
import { Phone, ShieldCheck, Truck, BadgePercent, Factory } from 'lucide-react';
import { useShopConstants } from '../../context/ShopContext';
import { formatINR } from '../../lib/format';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import Countdown from '../ui/Countdown';

const FACTS = [
  { icon: BadgePercent, label: 'Flat 80% off MRP' },
  { icon: Factory, label: 'Direct from Sivakasi' },
  { icon: Truck, label: 'Sealed carton dispatch' },
  { icon: ShieldCheck, label: 'Licensed & tested' },
];

export default function HowToOrder() {
  const { CONTACT, MIN_ORDER, PRIMARY_PHONE_INTL, WHATSAPP_LINK } = useShopConstants();
  return (
    <section className="bg-brand-navy text-white">
      <div className="border-b border-white/10">
        <ul className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
          {FACTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 px-3 py-3 text-xs sm:text-sm font-black uppercase tracking-wide text-white/85">
              <Icon size={18} className="text-brand-gold flex-shrink-0" /> {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
        <Countdown />
        <h2 className="text-center font-black text-xl md:text-2xl uppercase tracking-wide mt-6 mb-5">Order in 3 simple steps</h2>
        <ol className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
          {[
            { title: 'Browse & add', desc: 'Tap + on any item in the price list' },
            { title: 'Reach the minimum', desc: `Cart of ${formatINR(MIN_ORDER)} or more` },
            { title: 'Place order', desc: 'We confirm by call, you pay after' },
          ].map((s, i) => (
            <li key={s.title} className="bg-white/[0.07] border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col items-center text-center gap-2">
              <span className="w-9 h-9 rounded-full bg-brand-magenta text-white font-black text-base flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              <p className="font-black text-xs sm:text-sm leading-tight">{s.title}</p>
              <p className="text-white/65 text-xs font-medium leading-snug hidden sm:block">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/store" className="btn-primary w-full sm:w-auto">Browse the 2026 price list</Link>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full sm:w-auto">
            <WhatsAppIcon className="w-5 h-5" /> Chat on WhatsApp
          </a>
          <a href={`tel:+${PRIMARY_PHONE_INTL}`} className="btn-ghost w-full sm:w-auto">
            <Phone size={16} /> {CONTACT.primaryPhone}
          </a>
        </div>
      </div>
    </section>
  );
}
