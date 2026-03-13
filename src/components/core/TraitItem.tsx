'use client';

import { Trait } from '@/types/resources';
import { rollTrait } from '@/engine/dice';
import { useUIStore } from '@/stores/uiStore';
import DieIcon, { DieType } from './DieIcon';

const ALL_DICE: DieType[] = [4, 6, 8, 10, 12];

export default function TraitItem({ name, trait }: { name: string; trait: Trait }) {
  const setRollResult = useUIStore((state) => state.setRollResult);

  const handleRoll = () => {
    const result = rollTrait(trait, true); // Wild cards always roll wild die
    setRollResult({ name, result });
  };

  return (
    <div 
      onClick={handleRoll}
      className="group flex items-center justify-between px-2 py-0.5 hover:bg-black/5 cursor-pointer transition-colors border-b border-dotted border-gray-300 last:border-0"
    >
      <span className="font-bold text-[0.75rem] uppercase text-black/80">{name}</span>
      <div className="flex items-center gap-0.5">
        <div className="flex items-center -space-x-1">
          {ALL_DICE.map((d) => (
            <DieIcon 
              key={d} 
              type={d} 
              isActive={trait.dieType === d} 
              className={`w-4 h-4 ${trait.dieType === d ? 'text-black scale-110 z-10' : 'text-gray-400'}`} 
            />
          ))}
        </div>
        {trait.modifier !== 0 && (
          <span className="text-[0.7rem] font-black ml-1 text-black">
            {trait.modifier > 0 ? `+${trait.modifier}` : trait.modifier}
          </span>
        )}
      </div>
    </div>
  );
}
