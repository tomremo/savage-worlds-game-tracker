'use client';

import VitalHeader from '@/components/header/VitalHeader';
import ActiveCore from '@/components/core/ActiveCore';
import ManagementFooter from '@/components/footer/ManagementFooter';
import RollResult from '@/components/overlay/RollResult';

export default function Home() {
  return (
    <main className="relative min-h-screen pt-[16vh] pb-[12vh]">
      <VitalHeader />
      
      <div className="px-4 py-4 overflow-y-auto">
        <ActiveCore />
      </div>

      <RollResult />
    </main>
  );
}
