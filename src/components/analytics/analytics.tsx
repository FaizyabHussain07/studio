
'use client';

import { Suspense } from 'react';
import GoogleTagManager from './google-tag-manager';
import GoogleAnalytics from './google-analytics';

export function Analytics() {
  return (
    <Suspense>
      <GoogleTagManager />
      <GoogleAnalytics />
    </Suspense>
  );
}
