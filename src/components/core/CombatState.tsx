'use client';

import WoundTracker from './WoundTracker';
import FatigueTracker from './FatigueTracker';
import StatusGrid from './StatusGrid';

export default function CombatState() {
  return (
    <div className="p-2 space-y-4">
      <div className="grid grid-cols-2 divide-x divide-black border-b border-black pb-2">
        <FatigueTracker />
        <WoundTracker />
      </div>
      <StatusGrid />
    </div>
  );
}
