import { Truck, Clock, MapPin, PackageCheck, Video } from 'lucide-react';
import { DELIVERY_INFO } from '../../constants';

export default function DeliverySection() {
  const cards = [
    { icon: Clock, title: 'Dispatch time', body: DELIVERY_INFO.dispatchWindow },
    { icon: Truck, title: 'Transit time', body: DELIVERY_INFO.transitTime },
    { icon: MapPin, title: 'Where we deliver', body: DELIVERY_INFO.coverage },
    { icon: PackageCheck, title: 'Packing', body: DELIVERY_INFO.packing },
  ];

  return (
    <section id="delivery" className="py-14 md:py-16 bg-white border-t border-gray-100 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Shipping</p>
          <h2 className="section-title">Delivery &amp; transport</h2>
          <p className="text-gray-600 text-sm font-medium mt-2 max-w-2xl mx-auto">{DELIVERY_INFO.restrictions}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-5 flex flex-col gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center"><Icon size={22} /></div>
              <h3 className="font-black text-sm text-brand-navy uppercase tracking-wide">{title}</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0"><Video size={22} /></div>
          <div>
            <h3 className="font-black text-amber-900 text-sm uppercase tracking-wide mb-1.5">Unboxing policy — please record a video</h3>
            <p className="text-amber-900/90 font-medium text-sm leading-relaxed">
              Claims for damaged or missing items are accepted <span className="font-black">only with an unboxing video</span> recorded when the parcel is first opened, and shared with us on WhatsApp within 24 hours of delivery. Without a video we cannot raise a claim with the transporter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
