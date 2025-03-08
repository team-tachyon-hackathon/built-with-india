// app/saved-configs/[id]/page.tsx
"use client";

import SavedConfigDetail from '@/components/SavedConfigDetail';
import SavedConfigsNav from '@/components/SavedConfigsNav';

export default function SavedConfigDetailPage({ params }) {
  return (
    <div>
      <SavedConfigsNav />
      <div className="container mx-auto py-8">
        <SavedConfigDetail id={params.id} />
      </div>
    </div>
  );
}