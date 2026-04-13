export default function Loading() {
  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden">
      <div className="content-container py-16 lg:py-24 relative z-10 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-12 bg-white/5 rounded-lg w-64" />
          <div className="h-5 bg-white/5 rounded w-96" />
        </div>

        {/* Sort/filter bar skeleton */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
          <div className="h-5 bg-white/5 rounded w-32" />
          <div className="h-10 bg-white/5 rounded-full w-40" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-2 small:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="aspect-square bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-white/5 rounded-full w-16" />
                <div className="h-5 bg-white/5 rounded w-3/4" />
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="h-6 bg-white/5 rounded w-20" />
                  <div className="h-10 w-10 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
