'use client';

import { ShieldCheck, Truck, MessageCircle, Award } from 'lucide-react';

const POINTS = [
  { icon: ShieldCheck, title: 'Licensed & tested', desc: 'Sourced only from PESO-licensed Sivakasi manufacturers', color: 'bg-green-50 text-green-700' },
  { icon: Truck, title: 'Sealed dispatch', desc: 'Hand-packed cartons, sent by registered parcel services', color: 'bg-blue-50 text-blue-700' },
  { icon: MessageCircle, title: 'WhatsApp support', desc: 'Real people answer 9am–9pm, every day of the season', color: 'bg-purple-50 text-purple-700' },
  { icon: Award, title: 'Factory pricing', desc: 'Flat 80% off MRP with no coupon codes or conditions', color: 'bg-orange-50 text-orange-700' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 md:py-16 bg-brand-cream border-t border-gray-100">
      <div className="container mx-auto px-4 text-center mb-8">
        <p className="eyebrow mb-2">Why customers come back</p>
        <h2 className="section-title">Why choose B&amp;W</h2>
      </div>
      <ul className="container mx-auto px-4 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {POINTS.map(({ icon: Icon, title, desc, color }) => (
          <li key={title} className="card p-6 flex flex-col items-center text-center gap-3">
            <span className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}><Icon size={28} /></span>
            <p className="font-black text-sm text-brand-navy uppercase">{title}</p>
            <p className="text-gray-600 text-sm font-medium leading-snug">{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
