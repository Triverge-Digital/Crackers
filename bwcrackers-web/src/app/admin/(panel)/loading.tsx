/** Shown instantly while an admin page loads, so taps never feel frozen. */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-7 w-48 rounded-lg bg-gray-200 mb-2" />
      <div className="h-4 w-64 rounded bg-gray-200 mb-6" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[0, 1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-white border border-gray-200" />)}
      </div>
      <div className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="h-10 w-10 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 rounded bg-gray-200" />
              <div className="h-3 w-1/4 rounded bg-gray-100" />
            </div>
            <div className="h-5 w-16 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
