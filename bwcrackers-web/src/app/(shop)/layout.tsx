import ShopShell from '@/shop/shell/ShopShell';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>;
}
