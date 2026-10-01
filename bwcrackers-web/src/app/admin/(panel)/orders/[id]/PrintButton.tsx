'use client';

import { Printer } from 'lucide-react';
import { btnSecondary } from '@/admin/ui';

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`${btnSecondary} print:hidden`}>
      <Printer size={16} /> Print
    </button>
  );
}
