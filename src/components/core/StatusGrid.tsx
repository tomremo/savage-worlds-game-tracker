'use client';

import { useCharacterStore } from '@/stores/characterStore';

const STATUSES = ['Shaken', 'Distracted', 'Vulnerable', 'Entangled', 'Bound', 'Stunned'];

export default function StatusGrid() {
  const currentStatuses = useCharacterStore((state) => state.character.statuses);
  const toggleStatus = useCharacterStore((state) => state.toggleStatus);

  return (
    <div className="space-y-1">
      <span className="text-[0.65rem] font-bold uppercase">Status Conditions</span>
      <div className="grid grid-cols-3 gap-1">
        {STATUSES.map((status) => {
          const isActive = currentStatuses.includes(status);
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`py-1 px-0.5 text-[0.6rem] border border-black font-bold uppercase transition-all ${
                isActive
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-400'
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
