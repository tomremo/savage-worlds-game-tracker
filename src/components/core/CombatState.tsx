'use client';

import WoundTracker from './WoundTracker';
import FatigueTracker from './FatigueTracker';
import StatusGrid from './StatusGrid';

export default function CombatState() {
  return (
    <div className="parchment-card p-4 rounded-lg space-y-8">
      <h2 className="text-lg font-bold mb-3 border-b border-sepia-mid pb-1">Combat State</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <WoundTracker />
        <FatigueTracker />
      </div>

      <StatusGrid />
    </div>
  );
}
