'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function FatigueTracker() {
  const fatigue = useCharacterStore((state) => state.character.fatigue);
  const updateFatigue = useCharacterStore((state) => state.updateFatigue);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold uppercase text-sepia-dark">Fatigue</span>
      <div className="flex gap-2">
        {[0, 1, 2].map((val) => (
          <button
            key={val}
            onClick={() => updateFatigue(val - fatigue)}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
              fatigue >= val && val > 0
                ? 'bg-sepia-dark border-sepia-mid text-white shadow-lg scale-110'
                : fatigue === 0 && val === 0
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
