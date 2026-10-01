'use server';

import { revalidatePath } from 'next/cache';
import { adminClient } from '../auth';

export async function saveCustomer(id: string, form: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db } = await adminClient();
    const text = (k: string) => String(form.get(k) ?? '').trim() || null;
    const name = text('name');
    if (!name) return { ok: false, error: 'Name is required.' };
    const { error } = await db
      .from('customers')
      .update({ name, email: text('email'), address: text('address'), city: text('city'), state: text('state'), pincode: text('pincode'), admin_notes: text('admin_notes') })
      .eq('id', id);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/customers/${id}`);
    revalidatePath('/admin/customers');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
