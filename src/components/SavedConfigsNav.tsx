// components/SavedConfigsNav.tsx
import React from 'react';
import Link from 'next/link';

const SavedConfigsNav: React.FC = () => {
  return (
    <div className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-white font-bold text-lg">
              CI/CD Builder
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Workflow Builder
              </Link>
              <Link href="/dashboard" className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                Saved Configurations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedConfigsNav;