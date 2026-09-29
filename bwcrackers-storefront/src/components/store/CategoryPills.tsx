import { useEffect, useRef } from 'react';
import { categories } from '../../lib/catalog';

type Props = {
  selected: number | 'all';
  onSelect: (id: number | 'all') => void;
  showAll?: boolean;
};

export default function CategoryPills({ selected, onSelect, showAll = true }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the active pill visible when the selection changes from elsewhere (URL, footer link).
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [selected]);

  const pill = (active: boolean) =>
    `flex-shrink-0 px-3.5 min-h-[36px] rounded-full text-xs font-black uppercase tracking-wide transition-colors whitespace-nowrap ${
      active ? 'bg-brand-navy text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-navy/40 hover:text-brand-navy'
    }`;

  return (
    <div ref={scroller} className="flex gap-2 overflow-x-auto no-scrollbar scroll-fade-x py-1 -mx-1 px-1" role="group" aria-label="Filter by category">
      {showAll && (
        <button type="button" aria-pressed={selected === 'all'} onClick={() => onSelect('all')} className={pill(selected === 'all')}>
          All
        </button>
      )}
      {categories.map(cat => (
        <button key={cat.id} type="button" aria-pressed={selected === cat.id} onClick={() => onSelect(cat.id)} className={pill(selected === cat.id)}>
          {cat.name}
        </button>
      ))}
    </div>
  );
}
