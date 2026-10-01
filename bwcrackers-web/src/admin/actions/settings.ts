'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { adminClient } from '../auth';
import { normalizeSettings, ShopSettings } from '@/lib/settings';
import { SHOP_TAG } from '@/lib/shop-data';

const digits10 = (v: string) => {
  const d = v.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(d) ? d : null;
};

export async function saveSettings(form: FormData): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db } = await adminClient();
    const t = (k: string) => String(form.get(k) ?? '').trim();
    const n = (k: string) => Number(t(k));

    const primary = digits10(t('contact.primaryPhone'));
    const secondary = digits10(t('contact.secondaryPhone')) ?? '';
    const whatsapp = digits10(t('contact.whatsapp')) ?? primary;
    if (!primary) return { ok: false, error: 'Main phone must be a 10-digit mobile number.' };
    if (!(n('minOrder') >= 0)) return { ok: false, error: 'Minimum order must be a number.' };
    if (!(n('packingFeePct') >= 0 && n('packingFeePct') <= 20)) return { ok: false, error: 'Packing fee should be between 0 and 20%.' };
    if (!(n('discountPct') >= 0 && n('discountPct') <= 95)) return { ok: false, error: 'Discount should be between 0 and 95%.' };

    const settings: ShopSettings = normalizeSettings({
      orderingEnabled: form.get('orderingEnabled') === 'on',
      minOrder: Math.round(n('minOrder')),
      packingFeePct: n('packingFeePct'),
      discountPct: Math.round(n('discountPct')),
      dispatchDeadline: t('dispatchDeadline') || null,
      announcement: t('announcement').split('\n').map(s => s.trim()).filter(Boolean),
      contact: { primaryPhone: primary, secondaryPhone: secondary, whatsapp: whatsapp!, email: t('contact.email'), instagram: t('contact.instagram'), address: t('contact.address') },
      bank: { name: t('bank.name'), account: t('bank.account'), bank: t('bank.bank'), branch: t('bank.branch'), type: t('bank.type'), ifsc: t('bank.ifsc').toUpperCase(), upi: t('bank.upi') },
      delivery: { dispatchWindow: t('delivery.dispatchWindow'), transitTime: t('delivery.transitTime') },
      orderEmails: t('orderEmails').split(/[\s,]+/).filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
    });

    const { error } = await db.from('settings').update({ data: settings }).eq('id', 1);
    if (error) return { ok: false, error: error.message };
    revalidateTag(SHOP_TAG);
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
