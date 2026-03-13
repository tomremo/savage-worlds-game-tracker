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
            className="w-7 h-7 rounded-full bg-red-600 border border-black shadow flex items-center justify-center text-white text-[10px] font-bold cursor-pointer active:scale-95 transition-transform"
          >
            B
          </div>
        ))}
        {count === 0 && <span className="text-[10px] uppercase font-bold text-red-600">No Bennies</span>}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); addBennie(); }}
        className="mt-0.5 text-[8px] uppercase font-bold text-black border border-black px-1 leading-none h-4 hover:bg-black hover:text-white transition-colors"
      >
        Add Bennie
      </button>
    </div>
  );
}
