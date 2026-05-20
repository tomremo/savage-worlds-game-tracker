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
      className="group flex items-end justify-between px-1 py-[2px] cursor-pointer text-black"
    >
      <span className="font-bold text-[0.8rem] text-right leading-none pb-1">{name}</span>
      <div className="dotted-leader"></div>
      <div className="flex items-center gap-1 mb-0.5">
        <div className="flex items-center gap-[1px]">
          {ALL_DICE.map((d) => (
            <DieIcon 
              key={d} 
              type={d} 
              isActive={trait.dieType === d} 
              className={`w-[18px] h-[18px] ${trait.dieType === d ? 'text-black z-10 drop-shadow-sm' : 'text-gray-500 stroke-1'}`} 
            />
          ))}
        </div>
        <span className="text-[0.8rem] font-bold w-4 text-right">
          {trait.modifier !== 0 ? (trait.modifier > 0 ? `+${trait.modifier}` : trait.modifier) : ''}
        </span>
      </div>
    </div>
  );
}
