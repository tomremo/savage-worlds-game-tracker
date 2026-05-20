'use client';

import WoundTracker from './WoundTracker';
import FatigueTracker from './FatigueTracker';
import StatusGrid from './StatusGrid';

export default function CombatState() {
  return (
    <div className="p-2 bg-[#f4f4f4] space-y-2">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white border-2 border-black p-2 md:p-4">
        <FatigueTracker />
        
        <div className="font-extrabold text-xl md:text-2xl px-4 py-2 my-2 md:my-0">INC</div>
        
        <WoundTracker />
      </div>
      <StatusGrid />
    </div>
  );
}
