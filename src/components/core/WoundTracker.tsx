'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function WoundTracker() {
  const wounds = useCharacterStore((state) => state.character.wounds);
  const updateWounds = useCharacterStore((state) => state.updateWounds);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold uppercase text-sepia-dark">Wounds</span>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((val) => (
          <button
            key={val}
            onClick={() => updateWounds(val - wounds)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
              wounds >= val && val > 0
                ? 'bg-accent-red border-sepia-dark text-white shadow-lg scale-110'
                : wounds === 0 && val === 0
                ? 'bg-sepia-mid border-sepia-dark text-white'
                : 'border-sepia-mid text-sepia-mid'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
