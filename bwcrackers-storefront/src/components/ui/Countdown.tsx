import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { DISPATCH_DEADLINE } from '../../constants';

function parts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  const deadline = DISPATCH_DEADLINE ? new Date(DISPATCH_DEADLINE).getTime() : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!deadline) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [deadline]);

  if (!deadline || deadline - now <= 0) return null;
  const { days, hours, minutes, seconds } = parts(deadline - now);
  const cells = [
    { v: days, l: 'Days' },
    { v: hours, l: 'Hrs' },
    { v: minutes, l: 'Min' },
    { v: seconds, l: 'Sec' },
  ];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-navy" role="timer" aria-live="off">
        <Clock size={14} className="text-brand-magenta" />
        Diwali dispatch closes in {days}d {hours}h {minutes}m
      </span>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6" role="timer" aria-live="off">
      <div className="flex items-center gap-2 text-brand-gold">
        <Clock size={18} />
        <span className="text-xs sm:text-sm font-black uppercase tracking-widest">Diwali dispatch closes in</span>
      </div>
      <div className="flex gap-2">
        {cells.map(c => (
          <div key={c.l} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 min-w-[58px] text-center">
            <div className="text-xl font-black text-white leading-none tabular-nums">{String(c.v).padStart(2, '0')}</div>
            <div className="text-[11px] font-bold text-white/60 uppercase tracking-wider mt-1">{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
