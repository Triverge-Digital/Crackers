'use client';

import { useActionState } from 'react';
import { signIn } from '@/admin/actions/auth';
import { btnPrimary, inputCls, labelCls } from '@/admin/ui';

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelCls}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      {state?.error && <p className="text-sm text-red-700" role="alert">{state.error}</p>}
      <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
