import type { Metadata } from 'next';
import { requireAdmin } from '@/admin/auth';
import AdminNav from '@/admin/AdminNav';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s · Admin' }, robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { db, adminName } = await requireAdmin();
  const { count: newOrders } = await db.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending');
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 lg:pl-60 print:pl-0 print:bg-white">
      <AdminNav adminName={adminName} newOrders={newOrders ?? 0} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-28 lg:pb-10">{children}</div>
    </div>
  );
}
