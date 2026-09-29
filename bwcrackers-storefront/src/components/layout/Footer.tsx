import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { CONTACT, PRIMARY_PHONE_INTL, SECONDARY_PHONE_INTL, WHATSAPP_LINK, SITE_NAME } from '../../constants';
import { categories } from '../../lib/catalog';

export default function Footer() {
  const half = Math.ceil(categories.length / 2);
  return (
    <footer className="bg-brand-navy-deep text-white pt-14 pb-28 md:pb-10 border-t border-brand-gold/10">
      <div className="container mx-auto px-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1.4fr_1fr] gap-10 mb-10">
        <div>
          <img src="/logo.webp" alt={SITE_NAME} width={112} height={100} className="h-14 w-auto object-contain drop-shadow-lg mb-4" />
          <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-xs">
            Genuine Sivakasi fireworks shipped directly from the manufacturer's town, with a flat 80% discount on MRP on every item.
          </p>
          <div className="flex gap-3">
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="icon-btn bg-white/5 hover:bg-brand-magenta rounded-full"><Instagram size={20} /></a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="icon-btn bg-white/5 hover:bg-brand-whatsapp rounded-full"><MessageCircle size={20} /></a>
          </div>
        </div>

        <nav aria-label="Footer">
          <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-5">Navigate</h4>
          <ul className="space-y-1 text-gray-300 font-bold text-sm">
            {[
              ['Home', '/'], ['Store', '/store'], ['Collections', '/collections'], ['My Cart', '/cart'],
              ['Track Order', '/track'], ['How to Pay', '/#payment-info'], ['Delivery', '/#delivery'], ['FAQ', '/#faq'],
            ].map(([label, to]) => (
              <li key={to}><Link to={to} className="inline-block py-1.5 hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-5">Categories</h4>
          <div className="grid grid-cols-2 gap-x-4">
            {[categories.slice(0, half), categories.slice(half)].map((col, i) => (
              <ul key={i} className="space-y-1 text-gray-300 font-bold text-sm">
                {col.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/store/${cat.slug}`} className="inline-block py-1 hover:text-white transition-colors capitalize leading-snug">{cat.name.toLowerCase()}</Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>

        <address className="not-italic">
          <h4 className="text-brand-gold font-black uppercase tracking-widest text-xs mb-5">Contact</h4>
          <div className="space-y-3 text-sm font-bold text-gray-300">
            <a href={`tel:+${PRIMARY_PHONE_INTL}`} className="flex gap-3 items-center py-1 hover:text-white transition-colors"><Phone size={16} className="text-brand-gold flex-shrink-0" />+91 {CONTACT.primaryPhone}</a>
            <a href={`tel:+${SECONDARY_PHONE_INTL}`} className="flex gap-3 items-center py-1 hover:text-white transition-colors"><Phone size={16} className="text-brand-gold flex-shrink-0" />+91 {CONTACT.secondaryPhone}</a>
            <a href={`mailto:${CONTACT.email}`} className="flex gap-3 items-center py-1 hover:text-white transition-colors break-all"><Mail size={16} className="text-brand-gold flex-shrink-0" />{CONTACT.email}</a>
            <p className="flex gap-3 items-start py-1"><MapPin size={16} className="text-brand-gold flex-shrink-0 mt-0.5" />{CONTACT.address}</p>
          </div>
        </address>
      </div>

      <div className="container mx-auto px-6 pt-6 border-t border-white/5 flex items-center justify-center text-center">
        <span className="text-gray-400 text-xs font-black uppercase tracking-widest">© {new Date().getFullYear()} {SITE_NAME} · Sivakasi Direct</span>
      </div>
    </footer>
  );
}
