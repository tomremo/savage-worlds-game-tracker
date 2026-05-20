'use client';

import VitalHeader from '@/components/header/VitalHeader';
import ActiveCore from '@/components/core/ActiveCore';
import ManagementFooter from '@/components/footer/ManagementFooter';
import RollResult from '@/components/overlay/RollResult';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#1a120b] lg:p-8 flex flex-col items-center justify-start">
      {/* Paper sheet container */}
      <div className="w-full max-w-[1300px] bg-[#fbf8f1] min-h-screen lg:min-h-0 shadow-2xl lg:border-2 lg:border-black p-4 lg:p-6 relative">
        <div className="relative z-10 w-full space-y-6">
          <VitalHeader />
          <ActiveCore />
        </div>
      </div>
      <RollResult />
    </main>
  );
}
