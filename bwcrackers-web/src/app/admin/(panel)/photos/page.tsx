import { requireAdmin } from '@/admin/auth';
import { PageHeader } from '@/admin/ui';
import PhotoLibrary from './PhotoLibrary';

export const metadata = { title: 'Photos' };

export default async function PhotosPage() {
  const { db } = await requireAdmin();
  const { data: products } = await db.from('products').select('id, code, name, image_url').order('sort_order').order('id');
  return (
    <>
      <PageHeader title="Photo library" subtitle="Every product photo in one place. Give unused photos to a product in one tap." />
      <PhotoLibrary products={(products ?? []).map(p => ({ id: p.id, label: `${p.code} · ${p.name}`, hasPhoto: !!p.image_url }))} />
    </>
  );
}
