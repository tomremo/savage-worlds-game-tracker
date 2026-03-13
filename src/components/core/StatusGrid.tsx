'use client';

import { useCharacterStore } from '@/stores/characterStore';

const STATUSES = ['Shaken', 'Distracted', 'Vulnerable', 'Entangled', 'Bound', 'Stunned'];

export default function StatusGrid() {
  const currentStatuses = useCharacterStore((state) => state.character.statuses);
  const toggleStatus = useCharacterStore((state) => state.toggleStatus);

  return (
    <div className="space-y-2">
      <span className="text-xs font-bold uppercase text-sepia-dark">Status Conditions</span>
      <div className="grid grid-cols-3 gap-2">
        {STATUSES.map((status) => {
          const isActive = currentStatuses.includes(status);
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`py-2 px-1 text-[10px] rounded border font-bold uppercase transition-all ${
                isActive
                  ? 'bg-accent-red border-sepia-dark text-white shadow-md transform scale-95'
                  : 'bg-sepia-light/20 border-sepia-light text-sepia-mid'
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
