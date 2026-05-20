'use client';

import { useUIStore } from '@/stores/uiStore';
import FrontPage from './FrontPage';
import BackPage from './BackPage';

export default function ActiveCore() {
  const { viewMode } = useUIStore();

  if (viewMode === 'back') {
    return <BackPage />;
  }

  if (viewMode === 'dual') {
    return (
      <div className="flex flex-col xl:flex-row gap-8 items-start justify-center w-full">
        {/* Front Page Sheet */}
        <div className="w-full xl:w-1/2 max-w-[900px] xl:max-w-none border-4 border-black p-4 lg:p-6 parchment-paper shadow-2xl relative">
          <FrontPage />
        </div>

        {/* Back Page Sheet */}
        <div className="w-full xl:w-1/2 max-w-[900px] xl:max-w-none border-4 border-black p-4 lg:p-6 parchment-paper shadow-2xl relative">
          <BackPage />
        </div>
      </div>
    );
  }

  // Default: front page
  return <FrontPage />;
}
