'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function WoundTracker() {
  const wounds = useCharacterStore((state) => state.character.wounds);
  const updateWounds = useCharacterStore((state) => state.updateWounds);

  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[0.6rem] font-bold uppercase">Wounds</span>
      <div className="flex gap-1">
        {[-3, -2, -1].map((val, i) => {
          const woundVal = i + 1;
          return (
            <button
              key={val}
              onClick={() => updateWounds(woundVal - wounds)}
              className={`w-7 h-7 border border-black flex flex-col items-center justify-center font-bold text-[0.7rem] transition-all ${
                wounds >= woundVal
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              <span className="text-[0.5rem] leading-none mb-0.5">{val}</span>
              <span className="leading-none">{woundVal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
