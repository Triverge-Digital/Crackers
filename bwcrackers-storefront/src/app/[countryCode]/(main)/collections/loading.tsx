export default function Loading() {
  return (
    <div className="celebration-bg min-h-screen relative overflow-hidden">
      <div className="content-container py-16 lg:py-24 relative z-10 animate-pulse">
        <div className="mb-12 space-y-4">
          <div className="h-12 bg-white/5 rounded-lg w-64" />
          <div className="h-5 bg-white/5 rounded w-80" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="h-64 bg-white/5" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
