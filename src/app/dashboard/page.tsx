// app/saved-configs/page.tsx
"use client";

import SavedConfigsList from '@/components/SavedConfigsList';
import SavedConfigsNav from '@/components/SavedConfigsNav';

export default function SavedConfigsPage() {
  return (
    <div>
      <SavedConfigsNav />
      <div className="container mx-auto py-8">
        <SavedConfigsList />
      </div>
    </div>
  );
}