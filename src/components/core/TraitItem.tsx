'use client';

import { Trait } from '@/types/resources';
import { rollTrait } from '@/engine/dice';
import { useUIStore } from '@/stores/uiStore';
import DieIcon, { DieType } from './DieIcon';

const ALL_DICE: DieType[] = [4, 6, 8, 10, 12];

interface TraitItemProps {
  name: string;
  trait: Trait;
  type?: 'attributes' | 'skills';
}

export default function TraitItem({ name, trait, type = 'skills' }: TraitItemProps) {
  const setRollResult = useUIStore((state) => state.setRollResult);

  const handleRoll = () => {
    const result = rollTrait(trait, true); // Wild cards always roll wild die
    setRollResult({ name, result });
  };

  const isAttribute = type === 'attributes';

  return (
    <div 
      onClick={handleRoll}
      className={`group flex items-center justify-between px-2 py-1 cursor-pointer text-black hover:bg-gray-50/50 transition-colors ${
        isAttribute ? 'py-[3px]' : 'py-1'
      }`}
    >
      <span className="font-bold text-[0.8rem] leading-none select-none">
        {name}:
      </span>

      {!isAttribute && <div className="dotted-leader mx-1 flex-grow"></div>}
      {isAttribute && <div className="flex-grow"></div>}

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex items-center gap-[2px]">
          {ALL_DICE.map((d) => (
            <DieIcon 
              key={d} 
              type={d} 
              isActive={trait.dieType === d} 
              className={`w-[19px] h-[19px] ${
                trait.dieType === d 
                  ? 'text-black z-10 drop-shadow-sm scale-105' 
                  : 'text-gray-400 stroke-[1px] hover:text-gray-600'
              }`} 
            />
          ))}
        </div>
        {!isAttribute && (
          <span className="text-[0.8rem] font-bold w-4 text-right leading-none font-mono">
            {trait.modifier !== 0 ? (trait.modifier > 0 ? `+${trait.modifier}` : trait.modifier) : ''}
          </span>
        )}
      </div>
    </div>
  );
}
