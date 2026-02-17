'use client';

import React from 'react';
import ResponsiveShell from '@/components/layout/ResponsiveShell';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ResponsiveShell>
      {children}
    </ResponsiveShell>
  );
}
