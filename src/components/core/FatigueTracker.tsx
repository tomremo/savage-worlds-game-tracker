'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function FatigueTracker() {
  const fatigue = useCharacterStore((state) => state.character.fatigue);
  const updateFatigue = useCharacterStore((state) => state.updateFatigue);

  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-[0.6rem] font-bold uppercase">Fatigue</span>
      <div className="flex gap-1">
        {[-1, -2].map((val, i) => {
          const fatigueVal = i + 1;
          return (
            <button
              key={val}
              onClick={() => updateFatigue(fatigueVal - fatigue)}
              className={`w-7 h-7 border border-black flex flex-col items-center justify-center font-bold text-[0.7rem] transition-all ${
                fatigue >= fatigueVal
                  ? 'bg-black text-white'
                  : 'bg-white text-black'
              }`}
            >
              <span className="text-[0.5rem] leading-none mb-0.5">{val}</span>
              <span className="leading-none">{fatigueVal}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
