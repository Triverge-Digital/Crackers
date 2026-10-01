import { requireAdmin } from '@/admin/auth';
import { PageHeader } from '@/admin/ui';
import { normalizeSettings } from '@/lib/settings';
import SettingsForm from './SettingsForm';
import PriceListCard from './PriceListCard';

export const metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const { db } = await requireAdmin();
  const { data } = await db.from('settings').select('data').eq('id', 1).maybeSingle();
  const settings = normalizeSettings(data?.data);
  return (
    <>
      <PageHeader title="Shop settings" subtitle="Changes appear on the website within a few seconds" />
      <PriceListCard priceList={settings.priceList} />
      <SettingsForm settings={settings} />
    </>
  );
}
