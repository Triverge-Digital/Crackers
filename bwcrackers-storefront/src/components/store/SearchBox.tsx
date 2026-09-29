import { Search, X } from 'lucide-react';

type Props = { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean };

export default function SearchBox({ value, onChange, placeholder = 'Search crackers, sparklers, rockets…', autoFocus }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} aria-hidden="true" />
      <input
        type="search"
        enterKeyHint="search"
        autoFocus={autoFocus}
        aria-label="Search products"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input pl-11 pr-11 bg-white shadow-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 icon-btn min-w-[40px] min-h-[40px] text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
