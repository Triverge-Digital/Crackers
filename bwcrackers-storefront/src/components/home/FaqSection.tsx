import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS, WHATSAPP_LINK } from '../../constants';
import WhatsAppIcon from '../icons/WhatsAppIcon';

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <section id="faq" className="py-14 md:py-16 px-4 bg-white border-t border-gray-100 scroll-mt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow mb-2">Good to know</p>
          <h2 className="section-title">Frequently asked questions</h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="card overflow-hidden">
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 min-h-[56px] font-black text-sm md:text-base text-brand-navy hover:bg-gray-50"
                  >
                    {f.q}
                    <ChevronDown size={20} className={`flex-shrink-0 text-brand-magenta transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                </h3>
                {isOpen && (
                  <div id={`faq-${i}`} className="px-5 pb-5 text-sm text-gray-600 font-medium leading-relaxed">{f.a}</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 font-medium mb-3">Still have a question?</p>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="btn-whatsapp"><WhatsAppIcon className="w-5 h-5" /> Ask us on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
