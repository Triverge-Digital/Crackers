export default function Loading() {
  return (
    <div className="celebration-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-white/10 border-t-brand-gold-400 animate-spin" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-b-brand-accent-orange/50 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <p className="text-white/30 text-xs font-bold uppercase tracking-[0.3em]">
          Loading
        </p>
      </div>
    </div>
  )
}
