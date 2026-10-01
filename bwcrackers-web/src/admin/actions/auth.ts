'use server';

import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';

export async function signIn(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const db = await serverClient();
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'Email or password is incorrect.' };

  const { data: admin } = await db.from('admins').select('user_id').eq('user_id', data.user.id).maybeSingle();
  if (!admin) {
    await db.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }
  redirect('/admin');
}

export async function signOut() {
  const db = await serverClient();
  await db.auth.signOut();
  redirect('/admin/login');
}
