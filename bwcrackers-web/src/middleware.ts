import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Keeps the admin's Supabase session cookie fresh and sends signed-out visitors to /admin/login. */
export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: list => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  // getClaims verifies the JWT locally (asymmetric signing key) and refreshes an expired session.
  const { data } = await supabase.auth.getClaims();
  const isLogin = req.nextUrl.pathname.startsWith('/admin/login');
  if (!data?.claims?.sub && !isLogin) {
    const login = req.nextUrl.clone();
    login.pathname = '/admin/login';
    login.search = '';
    return NextResponse.redirect(login);
  }
  return res;
}

export const config = { matcher: ['/admin/:path*'] };
