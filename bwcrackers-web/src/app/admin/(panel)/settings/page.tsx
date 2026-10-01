import { requireAdmin } from '@/admin/auth';
import { PageHeader } from '@/admin/ui';
import { normalizeSettings } from '@/lib/settings';
import SettingsForm from './SettingsForm';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const { db } = await requireAdmin();
  const { data } = await db.from('settings').select('data').eq('id', 1).maybeSingle();
  return (
    <>
      <PageHeader title="Shop settings" subtitle="Changes appear on the website within a few seconds" />
      <SettingsForm settings={normalizeSettings(data?.data)} />
    </>
  );
}
