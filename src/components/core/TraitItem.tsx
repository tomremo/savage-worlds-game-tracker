'use client';

import { Trait } from '@/types/resources';
import { rollTrait } from '@/engine/dice';
import { useUIStore } from '@/stores/uiStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateUnifiedModifiers } from '@/engine/modifiers';
import DieIcon, { DieType } from './DieIcon';

const ALL_DICE: DieType[] = [4, 6, 8, 10, 12];

interface TraitItemProps {
  name: string;
  trait: Trait;
  type?: 'attributes' | 'skills';
}

export default function TraitItem({ name, trait, type = 'skills' }: TraitItemProps) {
  const setRollResult = useUIStore((state) => state.setRollResult);
  const modifiers = useUIStore((state) => state.modifiers);
  const character = useCharacterStore((state) => state.character);

  // Pre-calculate unified modifiers for hover previews
  const { total, breakdown } = calculateUnifiedModifiers({
    wounds: character.wounds,
    fatigue: character.fatigue,
    statuses: character.statuses,
    combatModifiers: modifiers,
    rollName: name,
    isRunningRoll: false
  });

  const handleRoll = () => {
    const result = rollTrait(trait, true); // Wild cards always roll wild die
    setRollResult({ name, result });
  };

  const isAttribute = type === 'attributes';

  return (
    <div 
      onClick={handleRoll}
      className={`group relative flex items-center justify-between px-2 py-1 cursor-pointer text-black hover:bg-gray-50/50 transition-colors ${
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

      {/* Modern Brutalist Roll Preview Tooltip */}
      {breakdown.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-52 bg-black text-white text-xs border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-50">
          <div className="font-black uppercase tracking-wider border-b border-gray-700 pb-1 mb-1.5 text-[9px] text-gray-300">
            {name} Roll Preview
          </div>
          <div className="space-y-1 font-mono text-[10px]">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.label}:</span>
                <span className={item.value > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {item.value > 0 ? `+${item.value}` : item.value}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-700 pt-1 mt-1 font-sans font-extrabold uppercase text-[10px] text-white">
              <span>Combined Mod:</span>
              <span className={total > 0 ? 'text-green-300' : total < 0 ? 'text-red-300' : ''}>
                {total >= 0 ? `+${total}` : total}
              </span>
            </div>
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
        </div>
      )}
    </div>
  );
}

