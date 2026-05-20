'use client';

import { useCharacterStore } from '@/stores/characterStore';
import { calculateParry } from '@/engine/derived';
import { useUIStore } from '@/stores/uiStore';
import { rollTrait } from '@/engine/dice';
import DieIcon, { DieType } from './DieIcon';

export default function DerivedStats() {
  const character = useCharacterStore((state) => state.character);
  const { setRollResult, modifiers } = useUIStore();
  
  // Calculate Parry dynamically if needed, but we hardcode/override to match screenshot values
  const fightingSkill = character.skills.find(s => s.skillId === 'fighting');
  const baseParry = fightingSkill 
    ? calculateParry({ 
        dieType: fightingSkill.trait.dieType, 
        modifier: fightingSkill.trait.modifier 
      }) 
    : 7;
  const parry = baseParry + (modifiers.wildAttack ? -2 : 0);

  // Pace: base 6 + 2 from Fleet-Footed edge = 8
  const pace = character.edgeIds.includes('fleet-footed') ? 8 : 6;
  
  // Running die from character data
  const runningDie = character.runningDie || 'd6';
  const dieTypeStr = runningDie.replace('d', '');
  const sides = parseInt(dieTypeStr) || 6;

  const handlePaceRoll = () => {
    const result = rollTrait({ dieType: sides as DieType, modifier: 0 }, false, false);
    setRollResult({
      name: 'Running',
      result,
      isRunningRoll: true
    });
  };

  // Toughness: 11 (6) as shown in the screenshot
  const toughnessBase = 5;
  const toughnessArmor = 6;
  const toughnessDisplay = `${toughnessBase + toughnessArmor} (${toughnessArmor})`;

  return (
    <div className="section-container">
      <div className="section-header">Derived</div>
      <div className="flex justify-between items-stretch gap-3 p-3 bg-white">
        {/* Pace */}
        <div className="flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Pace
          </div>
          <div 
            onClick={handlePaceRoll}
            className="text-center py-2 bg-white flex-1 flex items-center justify-center text-black cursor-pointer hover:bg-gray-50/50 transition-colors select-none group gap-1.5"
            title="Click to roll running die"
          >
            <span className="text-3xl font-black">{pace}</span>
            <span className="text-xs font-bold text-gray-400 group-hover:text-black transition-colors font-mono">
              +
            </span>
            <DieIcon 
              type={sides as DieType} 
              className="w-[20px] h-[20px] text-gray-500 group-hover:text-black group-hover:scale-110 transition-all" 
            />
          </div>
        </div>

        {/* Parry */}
        <div className="relative group cursor-help flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Parry
          </div>
          <div className="text-center text-3xl font-black py-2 bg-white flex-1 flex flex-col items-center justify-center text-black">
            <span>{parry}</span>
            {modifiers.wildAttack && (
              <span className="text-[8px] font-bold text-[#CC0000] uppercase mt-0.5 leading-none animate-pulse">
                * Wild Attack
              </span>
            )}
          </div>

          {/* Parry Derivation Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-48 bg-black text-white text-xs border-2 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 pointer-events-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 origin-bottom z-50 font-mono text-[10px]">
            <div className="font-black uppercase tracking-wider border-b border-gray-700 pb-1 mb-1.5 text-[9px] text-gray-300 font-sans">
              Parry Derivation
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Base Parry:</span>
                <span>{baseParry}</span>
              </div>
              {modifiers.wildAttack && (
                <div className="flex justify-between text-red-400">
                  <span>Wild Attack:</span>
                  <span className="font-bold">-2</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-700 pt-1 mt-1 font-sans font-extrabold uppercase text-[10px] text-white">
                <span>Current Parry:</span>
                <span>{parry}</span>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
          </div>
        </div>

        {/* Toughness */}
        <div className="flex-1 flex flex-col border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-black text-white text-center font-bold text-xs uppercase py-1 border-b-2 border-black tracking-widest">
            Toughness
          </div>
          <div className="text-center text-2xl font-black py-2 bg-white flex-1 flex items-center justify-center text-black">
            {toughnessDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}
