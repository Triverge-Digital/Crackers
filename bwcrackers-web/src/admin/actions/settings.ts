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

    // The price list PDF is managed by its own uploader, not this form — keep whatever is saved.
    const { data: current } = await db.from('settings').select('data').eq('id', 1).maybeSingle();
    settings.priceList = normalizeSettings(current?.data).priceList;

    const { error } = await db.from('settings').update({ data: settings }).eq('id', 1);
    if (error) return { ok: false, error: error.message };
    revalidateTag(SHOP_TAG);
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const BUCKET = 'products';

/**
 * One-time upload link for a new price list PDF. The browser sends the file
 * straight to Storage with it — a PDF is far bigger than a server action may receive.
 */
export async function createPriceListUpload(): Promise<{ ok: true; path: string; signedUrl: string } | { ok: false; error: string }> {
  try {
    const { db } = await adminClient();
    const path = `docs/price-list-${Date.now()}.pdf`;
    const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) return { ok: false, error: error?.message ?? 'Could not start the upload.' };
    return { ok: true, path, signedUrl: data.signedUrl };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/**
 * Points the website's "Price list" download at a PDF the admin has just
 * uploaded to Storage (`docs/…pdf`), or back at the bundled PDF when `path` is null.
 * The previous uploaded file is removed.
 */
export async function setPriceList(path: string | null, name?: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db } = await adminClient();
    if (path !== null && !/^docs\/[a-z0-9-]+\.pdf$/.test(path)) return { ok: false, error: 'Unexpected file location.' };

    if (path) {
      const { data: found } = await db.storage.from(BUCKET).list('docs', { search: path.slice(5) });
      if (!found?.some(f => f.name === path.slice(5))) return { ok: false, error: 'The upload did not finish. Please try again.' };
    }

    const { data: row } = await db.from('settings').select('data').eq('id', 1).maybeSingle();
    const settings = normalizeSettings(row?.data);
    const previous = settings.priceList?.url ?? null;

    settings.priceList = path
      ? { url: db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl, name: (name || 'Price list.pdf').slice(0, 120), updatedAt: new Date().toISOString() }
      : null;
    const { error } = await db.from('settings').update({ data: settings }).eq('id', 1);
    if (error) return { ok: false, error: error.message };

    const marker = `/object/public/${BUCKET}/`;
    const oldPath = previous?.includes(marker) ? previous.slice(previous.indexOf(marker) + marker.length) : null;
    if (oldPath && oldPath !== path && oldPath.startsWith('docs/')) await db.storage.from(BUCKET).remove([oldPath]);

    revalidateTag(SHOP_TAG);
    revalidatePath('/admin/settings');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
