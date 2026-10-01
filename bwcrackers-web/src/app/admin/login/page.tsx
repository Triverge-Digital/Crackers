import type { Metadata } from 'next';
import { supabaseConfigured } from '@/lib/supabase/env';
import LoginForm from './LoginForm';

export const metadata: Metadata = { title: 'Admin sign in', robots: { index: false } };

type Props = { searchParams: Promise<{ denied?: string; setup?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { denied } = await searchParams;
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.webp" alt="B&W Crackers" className="h-16 w-auto mx-auto" />
          <h1 className="text-xl font-extrabold text-brand-navy mt-3">Shop admin</h1>
          <p className="text-sm text-gray-500">Sign in to manage orders and products</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          {!supabaseConfigured ? (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              The database isn&apos;t connected yet. Add the Supabase keys to <code className="font-mono">.env.local</code> and restart the site.
            </p>
          ) : (
            <>
              {denied && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">This account does not have admin access.</p>}
              <LoginForm />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
