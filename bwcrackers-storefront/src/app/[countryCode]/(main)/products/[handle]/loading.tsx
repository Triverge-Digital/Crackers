export default function Loading() {
  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-brand-gold-400/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="content-container py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start animate-pulse">
          {/* Image gallery skeleton */}
          <div className="w-full space-y-4">
            <div className="aspect-square rounded-3xl bg-white/5 border border-white/10" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-white/5 border border-white/5" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="flex flex-col gap-y-8">
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-6">
              <div className="h-4 bg-white/5 rounded-full w-24" />
              <div className="h-10 bg-white/5 rounded-lg w-3/4" />
              <div className="h-6 bg-white/5 rounded-lg w-1/3" />
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-20 rounded-full bg-white/5 border border-white/10" />
                  ))}
                </div>
                <div className="h-14 rounded-full bg-white/5 border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
