'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import sharp from 'sharp';
import { adminClient } from '../auth';
import { SHOP_TAG } from '@/lib/shop-data';

export type Result<T = undefined> = { ok: true; message?: string; data?: T } | { ok: false; error: string };

const BUCKET = 'products';
const slugify = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/₹/g, 'rs').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function refreshShop() {
  revalidateTag(SHOP_TAG);
  revalidatePath('/admin/products');
  revalidatePath('/admin/categories');
}

const num = (v: FormDataEntryValue | null) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';

// ------------------------------------------------------------------ products --

export async function saveProduct(id: number | null, form: FormData): Promise<Result<{ id: number }>> {
  try {
    const { db } = await adminClient();
    const code = String(form.get('code') ?? '').trim().toUpperCase();
    const name = String(form.get('name') ?? '').trim();
    const categoryId = Number(form.get('category_id'));
    if (!code || !/^[A-Z0-9-]{1,16}$/.test(code)) return { ok: false, error: 'Code must be letters/numbers (e.g. 42 or GB1), up to 16 characters.' };
    if (!name) return { ok: false, error: 'Enter a product name.' };
    if (!categoryId) return { ok: false, error: 'Choose a category.' };
    let gallery: string[] = [];
    try { gallery = JSON.parse(String(form.get('gallery') || '[]')); } catch { /* keep empty */ }

    const row = {
      code,
      name,
      category_id: categoryId,
      unit: String(form.get('unit') ?? '').trim() || '1 BOX',
      mrp: num(form.get('mrp')),
      price: num(form.get('price')),
      description: String(form.get('description') ?? '').trim() || null,
      image_url: String(form.get('image_url') ?? '').trim() || null,
      gallery: gallery.filter(g => typeof g === 'string' && g),
      is_active: bool(form.get('is_active')),
      in_stock: bool(form.get('in_stock')),
      is_premium: bool(form.get('is_premium')),
      sort_order: Math.round(num(form.get('sort_order'))),
    };
    if (row.is_active && row.price <= 0) return { ok: false, error: 'Set a price before showing this product on the website.' };

    const res = id
      ? await db.from('products').update(row).eq('id', id).select('id').single()
      : await db.from('products').insert(row).select('id').single();
    if (res.error) return { ok: false, error: res.error.code === '23505' ? `Code ${code} is already used by another product.` : res.error.message };
    refreshShop();
    revalidatePath(`/admin/products/${res.data.id}`);
    return { ok: true, message: 'Product saved', data: { id: res.data.id } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

type QuickPatch = Partial<{ price: number; mrp: number; is_active: boolean; in_stock: boolean }>;

export async function quickUpdateProduct(id: number, patch: QuickPatch): Promise<Result> {
  try {
    const { db } = await adminClient();
    if (patch.is_active) {
      const { data } = await db.from('products').select('price').eq('id', id).single();
      if (!data || Number(data.price) <= 0) return { ok: false, error: 'Set a price before showing this product.' };
    }
    const { error } = await db.from('products').update(patch).eq('id', id);
    if (error) return { ok: false, error: error.message };
    refreshShop();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteProduct(id: number): Promise<Result> {
  try {
    const { db } = await adminClient();
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    refreshShop();
    return { ok: true, message: 'Product deleted' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// -------------------------------------------------------------------- photos --

/** Resizes an uploaded photo to a 1000px webp plus a 240px thumbnail and stores both. */
export async function uploadPhoto(form: FormData): Promise<Result<{ url: string }>> {
  try {
    const { db } = await adminClient();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose a photo first.' };
    if (file.size > 10 * 1024 * 1024) return { ok: false, error: 'Photo is larger than 10 MB.' };
    if (!file.type.startsWith('image/')) return { ok: false, error: 'That file is not an image.' };

    const input = Buffer.from(await file.arrayBuffer());
    const big = await sharp(input).rotate().resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const small = await sharp(input).rotate().resize({ width: 240, height: 240, fit: 'cover' }).webp({ quality: 72 }).toBuffer();

    const folder = form.get('folder') === 'library' ? 'library' : 'uploads';
    const base = `${folder}/${Date.now().toString(36)}-${slugify(file.name.replace(/\.\w+$/, '')).slice(0, 40) || 'photo'}`;
    const opts = { contentType: 'image/webp', upsert: false, cacheControl: '31536000' };
    const up1 = await db.storage.from(BUCKET).upload(`${base}.webp`, big, opts);
    if (up1.error) return { ok: false, error: up1.error.message };
    const up2 = await db.storage.from(BUCKET).upload(`${base}-sm.webp`, small, opts);
    if (up2.error) return { ok: false, error: up2.error.message };

    revalidatePath('/admin/photos');
    return { ok: true, data: { url: db.storage.from(BUCKET).getPublicUrl(`${base}.webp`).data.publicUrl } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export type LibraryPhoto = { url: string; path: string; name: string; usedBy: string | null };

/** Every photo in storage (library, catalog, uploads) with the product using it, if any. */
export async function listPhotos(): Promise<Result<LibraryPhoto[]>> {
  try {
    const { db } = await adminClient();
    const folders = ['library', 'catalog', 'uploads'];
    const all: { path: string; name: string }[] = [];
    for (const folder of folders) {
      const { data } = await db.storage.from(BUCKET).list(folder, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
      for (const f of data ?? []) if (f.name.endsWith('.webp') && !f.name.endsWith('-sm.webp')) all.push({ path: `${folder}/${f.name}`, name: f.name });
    }
    const { data: products } = await db.from('products').select('name, code, image_url, gallery');
    const usedBy = new Map<string, string>();
    for (const p of products ?? []) for (const u of [p.image_url, ...(p.gallery ?? [])]) if (u) usedBy.set(u, `${p.code} · ${p.name}`);
    return {
      ok: true,
      data: all.map(f => {
        const url = db.storage.from(BUCKET).getPublicUrl(f.path).data.publicUrl;
        return { url, path: f.path, name: f.name.replace(/\.webp$/, ''), usedBy: usedBy.get(url) ?? null };
      }),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deletePhoto(path: string): Promise<Result> {
  try {
    const { db } = await adminClient();
    const { error } = await db.storage.from(BUCKET).remove([path, path.replace(/\.webp$/, '-sm.webp')]);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/admin/photos');
    return { ok: true, message: 'Photo deleted' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Sets a photo as a product's main image (from the photo library). */
export async function assignPhoto(productId: number, url: string): Promise<Result> {
  try {
    const { db } = await adminClient();
    const { error } = await db.from('products').update({ image_url: url }).eq('id', productId);
    if (error) return { ok: false, error: error.message };
    refreshShop();
    revalidatePath('/admin/photos');
    return { ok: true, message: 'Photo assigned' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ---------------------------------------------------------------- categories --

export async function saveCategory(id: number | null, name: string, isActive = true): Promise<Result> {
  try {
    const { db } = await adminClient();
    const clean = name.trim();
    if (!clean) return { ok: false, error: 'Enter a category name.' };
    if (id) {
      const { error } = await db.from('categories').update({ name: clean, is_active: isActive }).eq('id', id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data: last } = await db.from('categories').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
      const { error } = await db.from('categories').insert({ name: clean, slug: slugify(clean), sort_order: (last?.sort_order ?? 0) + 10, is_active: isActive });
      if (error) return { ok: false, error: error.code === '23505' ? 'A category with that name already exists.' : error.message };
    }
    refreshShop();
    return { ok: true, message: 'Category saved' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function moveCategory(id: number, direction: -1 | 1): Promise<Result> {
  try {
    const { db } = await adminClient();
    const { data: cats } = await db.from('categories').select('id, sort_order').order('sort_order').order('id');
    if (!cats) return { ok: false, error: 'Could not load categories' };
    const i = cats.findIndex(c => c.id === id);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= cats.length) return { ok: true };
    [cats[i], cats[j]] = [cats[j], cats[i]];
    await Promise.all(cats.map((c, idx) => db.from('categories').update({ sort_order: (idx + 1) * 10 }).eq('id', c.id)));
    refreshShop();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCategory(id: number): Promise<Result> {
  try {
    const { db } = await adminClient();
    const { count } = await db.from('products').select('id', { count: 'exact', head: true }).eq('category_id', id);
    if ((count ?? 0) > 0) return { ok: false, error: 'Move or delete the products in this category first.' };
    const { error } = await db.from('categories').delete().eq('id', id);
    if (error) return { ok: false, error: error.message };
    refreshShop();
    return { ok: true, message: 'Category deleted' };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
