'use client';

import { useCharacterStore } from '@/stores/characterStore';

export default function BenniePool({ count }: { count: number }) {
  const addBennie = useCharacterStore((state) => state.addBennie);
  const spendBennie = useCharacterStore((state) => state.spendBennie);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1" onClick={spendBennie} title="Click to spend Bennie">
        {Array.from({ length: Math.max(0, count) }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-accent-red border-2 border-sepia-dark shadow-md flex items-center justify-center text-white text-[10px] font-bold cursor-pointer active:scale-90 transition-transform"
          >
            B
          </div>
        ))}
        {count === 0 && <span className="text-[10px] uppercase font-bold text-accent-red">No Bennies</span>}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); addBennie(); }}
        className="mt-1 text-[10px] uppercase font-bold text-sepia-dark underline hover:text-accent-red"
      >
        Add Bennie
      </button>
    </div>
  );
}
