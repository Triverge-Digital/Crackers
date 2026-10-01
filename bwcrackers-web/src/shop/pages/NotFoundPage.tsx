'use client';

import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center min-h-[60vh]">
      <p className="eyebrow mb-3">404</p>
      <h1 className="section-title text-3xl">That page fizzled out</h1>
      <p className="text-gray-600 text-sm font-medium mt-3 mb-8">The link may be old or mistyped. The 2026 price list is one tap away.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-outline">Go home</Link>
        <Link href="/store" className="btn-primary">Browse the store</Link>
      </div>
    </div>
  );
}
